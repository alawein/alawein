import { flattenHubViewDefinitions } from './architecture.mjs';

const STATUS_GROUP_KEYS = Object.freeze(['todo', 'inProgress', 'complete']);

function asArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function validatePropertyExists(databasePlan, propertyName, context) {
  const propertySpec = databasePlan.propertySpecs.get(propertyName);
  if (!propertySpec) {
    throw new Error(
      `${context}: property '${propertyName}' is not defined on ${databasePlan.databaseConfig.title}.`,
    );
  }
  return propertySpec;
}

function validateOptionFilter(propertySpec, operatorType, operatorPayload, context) {
  if (propertySpec.type !== operatorType) {
    throw new Error(
      `${context}: property '${propertySpec.propertyName}' is '${propertySpec.type}', not '${operatorType}'.`,
    );
  }

  const allowedOptions = new Set(propertySpec.options || []);
  for (const operator of ['equals', 'does_not_equal', 'contains', 'does_not_contain']) {
    for (const value of asArray(operatorPayload?.[operator])) {
      if (allowedOptions.size > 0 && !allowedOptions.has(value)) {
        throw new Error(
          `${context}: value '${value}' is not allowed for ${propertySpec.propertyName}.`,
        );
      }
    }
  }
}

function validateFilterNode(filter, databasePlan, context) {
  if (!filter) return;

  if (Array.isArray(filter.and)) {
    filter.and.forEach((entry, index) =>
      validateFilterNode(entry, databasePlan, `${context} [and:${index}]`),
    );
    return;
  }

  if (Array.isArray(filter.or)) {
    filter.or.forEach((entry, index) =>
      validateFilterNode(entry, databasePlan, `${context} [or:${index}]`),
    );
    return;
  }

  const propertySpec = validatePropertyExists(databasePlan, filter.property, context);
  for (const [operatorType, operatorPayload] of Object.entries(filter)) {
    if (operatorType === 'property') continue;
    if (operatorType === 'status' || operatorType === 'select' || operatorType === 'multi_select') {
      validateOptionFilter(propertySpec, operatorType, operatorPayload, context);
    }
  }
}

export function validateDatabaseStatusMapping(databasePlan) {
  const statusField = databasePlan.fieldSpecs.get('status');
  const statusGroups = databasePlan.databaseConfig.statusGroups;

  if (!statusField) {
    if (statusGroups) {
      throw new Error(
        `${databasePlan.databaseConfig.title} defines status groups but has no status field.`,
      );
    }
    return;
  }

  if (!statusGroups) {
    throw new Error(
      `${databasePlan.databaseConfig.title} has a status field but no checked-in status group mapping.`,
    );
  }

  const statusProperty = databasePlan.propertySpecs.get(statusField.propertyName);
  const vocabulary = statusProperty?.options || [];
  const assigned = new Map();

  for (const groupKey of Object.keys(statusGroups)) {
    if (!STATUS_GROUP_KEYS.includes(groupKey)) {
      throw new Error(
        `${databasePlan.databaseConfig.title} uses unsupported status group '${groupKey}'.`,
      );
    }
  }

  for (const [groupKey, optionNames] of Object.entries(statusGroups)) {
    if (!Array.isArray(optionNames) || optionNames.length === 0) continue;
    for (const optionName of optionNames) {
      if (!vocabulary.includes(optionName)) {
        throw new Error(
          `${databasePlan.databaseConfig.title} maps unknown status '${optionName}' into '${groupKey}'.`,
        );
      }
      if (assigned.has(optionName)) {
        throw new Error(
          `${databasePlan.databaseConfig.title} assigns status '${optionName}' to multiple groups.`,
        );
      }
      assigned.set(optionName, groupKey);
    }
  }

  for (const optionName of vocabulary) {
    if (!assigned.has(optionName)) {
      throw new Error(
        `${databasePlan.databaseConfig.title} leaves status '${optionName}' unmapped.`,
      );
    }
  }

  if (databasePlan.databaseConfig.requireFullStatusGroups) {
    for (const groupKey of STATUS_GROUP_KEYS) {
      if (!statusGroups[groupKey]?.length) {
        throw new Error(
          `${databasePlan.databaseConfig.title} must populate the '${groupKey}' status group.`,
        );
      }
    }
  }
}

export function validateStatusMappings(databasePlans) {
  databasePlans.forEach(validateDatabaseStatusMapping);
}

export function validateRelationOwnership(databaseConfigs) {
  const sourcePropertyKeys = new Set();
  const targetPropertyKeys = new Set();
  const pairKeys = new Set();

  for (const databaseConfig of databaseConfigs) {
    for (const relationProperty of databaseConfig.relationProperties || []) {
      const sourcePropertyKey = `${databaseConfig.key}:${relationProperty.name}`;
      const targetPropertyKey = `${relationProperty.target}:${relationProperty.syncedPropertyName}`;
      const pairKey = `${sourcePropertyKey}->${targetPropertyKey}`;
      const inversePairKey = `${targetPropertyKey}->${sourcePropertyKey}`;

      if (sourcePropertyKeys.has(sourcePropertyKey)) {
        throw new Error(`Duplicate relation property owner detected for ${sourcePropertyKey}.`);
      }
      if (targetPropertyKeys.has(targetPropertyKey)) {
        throw new Error(`Duplicate synced relation property detected for ${targetPropertyKey}.`);
      }
      if (pairKeys.has(pairKey) || pairKeys.has(inversePairKey)) {
        throw new Error(`Duplicate inverse relation declaration detected for ${pairKey}.`);
      }

      sourcePropertyKeys.add(sourcePropertyKey);
      targetPropertyKeys.add(targetPropertyKey);
      pairKeys.add(pairKey);
    }
  }
}

export function validateViewDefinitions(
  databaseConfigs,
  databasePlansByKey,
  viewDefinitions = flattenHubViewDefinitions(databaseConfigs),
) {
  for (const viewDefinition of viewDefinitions) {
    const databasePlan = databasePlansByKey[viewDefinition.databaseKey];
    if (!databasePlan) continue;

    const context = `${viewDefinition.hubKey}:${viewDefinition.name}`;
    validateFilterNode(viewDefinition.filter, databasePlan, context);

    for (const sort of viewDefinition.sorts || []) {
      validatePropertyExists(databasePlan, sort.property, `${context} sort`);
    }
  }
}

export function validateMigrationInputs(databaseConfigs, databasePlans, databasePlansByKey) {
  validateRelationOwnership(databaseConfigs);
  validateStatusMappings(databasePlans);
  validateViewDefinitions(databaseConfigs, databasePlansByKey);
}
