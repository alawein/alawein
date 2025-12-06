#!/usr/bin/env python3
"""
Monorepo Structure Validation Script

Validates that the repository follows the defined monorepo standards.
Run this script to ensure compliance with structural requirements.
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Set, Tuple

class MonorepoValidator:
    def __init__(self, root_path: str = "."):
        self.root = Path(root_path).resolve()
        self.errors = []
        self.warnings = []

    def validate(self) -> bool:
        """Run all validation checks"""
        print("🔍 Validating monorepo structure...")

        self.check_root_structure()
        self.check_metahub_structure()
        self.check_organization_structure()
        self.check_platform_structure()
        self.check_package_structure()
        self.check_workspace_configuration()
        self.check_documentation()

        self.print_results()
        return len(self.errors) == 0

    def check_root_structure(self):
        """Validate root level structure"""
        print("\n📁 Checking root structure...")

        required_dirs = {
            ".metaHub", "organizations", "platforms",
            "packages", "docs", "tools", "archive"
        }

        required_files = {"README.md", "package.json", ".gitignore"}

        # Check required directories
        for dir_name in required_dirs:
            dir_path = self.root / dir_name
            if not dir_path.exists():
                self.errors.append(f"Missing required directory: {dir_name}")
            elif not dir_path.is_dir():
                self.errors.append(f"Path exists but is not a directory: {dir_name}")

        # Check required files
        for file_name in required_files:
            file_path = self.root / file_name
            if not file_path.exists():
                self.errors.append(f"Missing required file: {file_name}")
            elif not file_path.is_file():
                self.errors.append(f"Path exists but is not a file: {file_name}")

        # Check for too many root files
        root_files = [f for f in self.root.iterdir()
                     if f.is_file() and not f.name.startswith('.')]
        if len(root_files) > 10:
            self.warnings.append(f"Too many root files ({len(root_files)}). Should be < 10")

    def check_metahub_structure(self):
        """Validate MetaHub structure"""
        print("\n🏗️ Checking MetaHub structure...")

        metahub_path = self.root / ".metaHub"
        if not metahub_path.exists():
            return

        required_metahub_dirs = {
            "ci-cd", "tooling", "automation", "templates", "governance", "configs"
        }

        for dir_name in required_metahub_dirs:
            dir_path = metahub_path / dir_name
            if not dir_path.exists():
                self.errors.append(f"Missing MetaHub directory: .metaHub/{dir_name}")

    def check_organization_structure(self):
        """Validate organization structure"""
        print("\n🏢 Checking organization structure...")

        orgs_path = self.root / "organizations"
        if not orgs_path.exists():
            return

        for org_dir in orgs_path.iterdir():
            if org_dir.is_dir() and not org_dir.name.startswith('.'):
                self._validate_single_organization(org_dir)

    def _validate_single_organization(self, org_path: Path):
        """Validate a single organization's structure"""
        required_subdirs = {"apps", "packages", "docs", "tools"}

        for subdir in required_subdirs:
            subdir_path = org_path / subdir
            if not subdir_path.exists():
                self.errors.append(f"Missing {subdir}/ in organization {org_path.name}")

        # Check organization naming convention
        if not org_path.name.endswith('-llc'):
            self.warnings.append(f"Organization name should end with '-llc': {org_path.name}")

    def check_platform_structure(self):
        """Validate platform structure"""
        print("\n🚀 Checking platform structure...")

        platforms_path = self.root / "platforms"
        if not platforms_path.exists():
            return

        for platform_dir in platforms_path.iterdir():
            if platform_dir.is_dir() and not platform_dir.name.startswith('.'):
                self._validate_single_platform(platform_dir)

    def _validate_single_platform(self, platform_path: Path):
        """Validate a single platform's structure"""
        required_subdirs = {"src", "public", "tests", "docs"}

        for subdir in required_subdirs:
            subdir_path = platform_path / subdir
            if not subdir_path.exists():
                self.warnings.append(f"Missing {subdir}/ in platform {platform_path.name}")

        # Check for package.json
        package_json = platform_path / "package.json"
        if not package_json.exists():
            self.warnings.append(f"Missing package.json in platform {platform_path.name}")

    def check_package_structure(self):
        """Validate package structure"""
        print("\n📦 Checking package structure...")

        packages_path = self.root / "packages"
        if not packages_path.exists():
            return

        for package_dir in packages_path.iterdir():
            if package_dir.is_dir() and not package_dir.name.startswith('.'):
                self._validate_single_package(package_dir)

    def _validate_single_package(self, package_path: Path):
        """Validate a single package's structure"""
        package_json = package_path / "package.json"
        if not package_json.exists():
            self.errors.append(f"Missing package.json in package {package_path.name}")
            return

        # Validate package naming
        try:
            with open(package_json, 'r') as f:
                config = json.load(f)

            name = config.get('name', '')
            if not name.startswith('@monorepo/'):
                self.errors.append(f"Package name should start with '@monorepo/': {name}")

            # Check for required files
            readme = package_path / "README.md"
            if not readme.exists():
                self.warnings.append(f"Missing README.md in package {package_path.name}")

        except json.JSONDecodeError:
            self.errors.append(f"Invalid JSON in package.json: {package_path.name}")

    def check_workspace_configuration(self):
        """Validate workspace configuration"""
        print("\n⚙️ Checking workspace configuration...")

        package_json = self.root / "package.json"
        if not package_json.exists():
            return

        try:
            with open(package_json, 'r') as f:
                config = json.load(f)

            workspaces = config.get('workspaces', [])
            if not isinstance(workspaces, list):
                self.errors.append("workspaces should be an array in root package.json")
                return

            required_workspaces = [
                "organizations/*",
                "platforms/*",
                "packages/*"
            ]

            for ws in required_workspaces:
                if ws not in workspaces:
                    self.warnings.append(f"Missing workspace pattern: {ws}")

        except json.JSONDecodeError:
            self.errors.append("Invalid JSON in root package.json")

    def check_documentation(self):
        """Check documentation requirements"""
        print("\n📚 Checking documentation...")

        docs_path = self.root / "docs"
        if not docs_path.exists():
            self.errors.append("Missing docs/ directory")
            return

        required_docs_dirs = {"architecture", "guides", "api", "governance"}
        for dir_name in required_docs_dirs:
            dir_path = docs_path / dir_name
            if not dir_path.exists():
                self.warnings.append(f"Missing documentation directory: docs/{dir_name}")

    def print_results(self):
        """Print validation results"""
        print("\n" + "="*50)
        print("📊 VALIDATION RESULTS")
        print("="*50)

        if self.errors:
            print(f"\n❌ ERRORS ({len(self.errors)}):")
            for error in self.errors:
                print(f"  • {error}")

        if self.warnings:
            print(f"\n⚠️ WARNINGS ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"  • {warning}")

        if not self.errors and not self.warnings:
            print("\n✅ All checks passed! Monorepo structure is valid.")
        elif not self.errors:
            print(f"\n✅ Structure is valid with {len(self.warnings)} warnings.")
        else:
            print(f"\n❌ Structure validation failed with {len(self.errors)} errors.")

def main():
    """Main entry point"""
    if len(sys.argv) > 1:
        root_path = sys.argv[1]
    else:
        root_path = "."

    validator = MonorepoValidator(root_path)
    success = validator.validate()

    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
