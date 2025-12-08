import yaml
import sys

workflows = [
    '.github/workflows/ci-main.yml',
    '.github/workflows/deploy-production.yml',
    '.github/workflows/governance.yml',
    '.github/workflows/security.yml',
    '.github/workflows/quality.yml',
    '.github/workflows/automation.yml'
]

print("🔍 Validating GitHub Workflows...\n")

all_valid = True
for workflow in workflows:
    try:
        with open(workflow, 'r', encoding='utf-8') as f:
            yaml.safe_load(f)
        print(f"✅ {workflow}: Valid YAML")
    except Exception as e:
        print(f"❌ {workflow}: Invalid - {str(e)}")
        all_valid = False

print("\n" + "="*50)
if all_valid:
    print("✅ All workflows are valid!")
    sys.exit(0)
else:
    print("❌ Some workflows have errors")
    sys.exit(1)
