#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const LOVABLE_DIRECTORIES = [
  'templates/classic-portfolio/.lovable',
  'templates/cyberpunk-portfolio/.lovable',
  'templates/docs-academic/.lovable',
  'templates/docs-blog/.lovable',
  'templates/docs-cyberpunk/.lovable',
  'templates/docs-developer/.lovable',
  'templates/docs-magazine/.lovable',
  'templates/docs-minimal/.lovable',
  'templates/ecommerce-luxury/.lovable',
  'templates/ecommerce-minimal/.lovable',
  'templates/ecommerce-storefront/.lovable',
  'templates/ecommerce-streetwear/.lovable',
  'templates/ecommerce-tech/.lovable',
  'templates/ecommerce-vintage/.lovable',
  'templates/family-drmalowein/.lovable',
  'templates/family-rounaq/.lovable',
  'templates/fitness-cyberpunk/.lovable',
  'templates/fitness-minimal/.lovable',
  'templates/fitness-nature/.lovable',
  'templates/fitness-neon/.lovable',
  'templates/fitness-tracker/.lovable',
  'templates/fitness-zen/.lovable',
  'templates/landing-corporate/.lovable',
  'templates/landing-creative/.lovable',
  'templates/landing-gradient/.lovable',
  'templates/landing-minimal/.lovable',
  'templates/landing-page/.lovable',
  'templates/landing-startup/.lovable',
  'templates/product-attributa/.lovable',
  'templates/product-foundry/.lovable',
  'templates/product-helios/.lovable',
  'templates/product-librex/.lovable',
  'templates/product-liveiticonic/.lovable',
  'templates/product-llmworks/.lovable',
  'templates/product-mezan/.lovable',
  'templates/product-qaplibria/.lovable',
  'templates/product-qmlab/.lovable',
  'templates/product-repz/.lovable',
  'templates/product-simcore/.lovable',
  'templates/product-talai/.lovable',
  'templates/quantum-portfolio/.lovable',
  'templates/saas-aurora/.lovable',
  'templates/saas-dashboard/.lovable',
  'templates/saas-forest/.lovable',
  'templates/saas-midnight/.lovable',
  'templates/saas-neon/.lovable',
  'templates/saas-ocean/.lovable',
];

const LOVABLE_FILES = [
  '.ai-system/automation/prompts/project/LOVABLE_FULLSTACK_TEMPLATE_SYSTEM.md',
  '.ai-system/automation/prompts/project/LOVABLE_TEMPLATE_SUPERPROMPT.md',
  '.ai-system/knowledge/prompts/architecture/LOVABLE_FULLSTACK_TEMPLATE_SYSTEM.md',
  '.metaHub/automation/python/prompts/project/LOVABLE_FULLSTACK_TEMPLATE_SYSTEM.md',
  '.metaHub/automation/python/prompts/project/LOVABLE_TEMPLATE_SUPERPROMPT.md',
  'organizations/alawein-technologies-llc/packages/design-system/src/tokens/lovable-animation.ts',
  'organizations/alawein-technologies-llc/packages/design-system/src/tokens/lovable-colors.ts',
  'organizations/alawein-technologies-llc/packages/design-system/src/tokens/lovable-effects.ts',
  'organizations/alawein-technologies-llc/packages/design-system/src/tokens/lovable-spacing.ts',
  'organizations/alawein-technologies-llc/packages/design-system/src/tokens/lovable-typography.ts',
  'templates/_imports/quantum-dev-profile/design-system/src/tokens/lovable-animation.ts',
  'templates/_imports/quantum-dev-profile/design-system/src/tokens/lovable-colors.ts',
  'templates/_imports/quantum-dev-profile/design-system/src/tokens/lovable-effects.ts',
  'templates/_imports/quantum-dev-profile/design-system/src/tokens/lovable-spacing.ts',
  'templates/_imports/quantum-dev-profile/design-system/src/tokens/lovable-typography.ts',
];

function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✅ Removed directory: ${dirPath}`);
    return true;
  }
  return false;
}

function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`✅ Removed file: ${filePath}`);
    return true;
  }
  return false;
}

function main() {
  console.log('🧹 Starting Lovable reference cleanup...\n');

  let removedDirs = 0;
  let removedFiles = 0;

  // Remove directories
  console.log('📁 Removing Lovable directories...');
  LOVABLE_DIRECTORIES.forEach((dir) => {
    if (removeDirectory(dir)) removedDirs++;
  });

  // Remove files
  console.log('\n📄 Removing Lovable files...');
  LOVABLE_FILES.forEach((file) => {
    if (removeFile(file)) removedFiles++;
  });

  // Clean up coverage files (generated, safe to remove)
  console.log('\n🧽 Cleaning coverage files...');
  const coverageDir = 'coverage/GitHub';
  if (fs.existsSync(coverageDir)) {
    fs.rmSync(coverageDir, { recursive: true, force: true });
    console.log('✅ Removed coverage directory');
  }

  console.log(`\n🎉 Cleanup complete!`);
  console.log(`   Directories removed: ${removedDirs}`);
  console.log(`   Files removed: ${removedFiles}`);
  console.log(`   Total items cleaned: ${removedDirs + removedFiles}`);
}

if (require.main === module) {
  main();
}

module.exports = { removeDirectory, removeFile };
