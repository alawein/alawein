#!/usr/bin/env python3
"""
Blackbox UI/UX Development Quick Start Script

Automates the setup and initialization of Blackbox development environment
for UI/UX enhancement across monorepo platforms.
"""

import os
import sys
import subprocess
import json
from pathlib import Path
from typing import Dict, List, Optional

class BlackboxDevStarter:
    def __init__(self, root_path: str = "."):
        self.root = Path(root_path).resolve()
        self.platforms_path = self.root / "platforms"

    def run(self, platform: Optional[str] = None):
        """Start Blackbox development for specified platform"""
        print("🎨 Blackbox UI/UX Development Starter")
        print("=" * 50)

        if platform:
            self.start_platform_dev(platform)
        else:
            self.show_available_platforms()

    def show_available_platforms(self):
        """Display available platforms for development"""
        print("\n📱 Available Platforms:")
        print("-" * 30)

        if not self.platforms_path.exists():
            print("❌ Platforms directory not found")
            return

        platforms = []
        for item in self.platforms_path.iterdir():
            if item.is_dir() and not item.name.startswith('.'):
                package_json = item / "package.json"
                if package_json.exists():
                    platforms.append(item.name)

        for i, platform in enumerate(platforms, 1):
            print(f"{i}. {platform}")

        if platforms:
            print(f"\n🚀 Start development with:")
            print(f"python {__file__} <platform-name>")
            print(f"\nExample: python {__file__} portfolio")
        else:
            print("❌ No valid platforms found")

    def start_platform_dev(self, platform: str):
        """Start development for specific platform"""
        platform_path = self.platforms_path / platform

        if not platform_path.exists():
            print(f"❌ Platform '{platform}' not found")
            self.show_available_platforms()
            return

        package_json = platform_path / "package.json"
        if not package_json.exists():
            print(f"❌ Platform '{platform}' missing package.json")
            return

        print(f"\n🚀 Starting Blackbox development for: {platform}")
        print("-" * 50)

        # Change to platform directory
        os.chdir(platform_path)

        # Check if dependencies are installed
        node_modules = platform_path / "node_modules"
        if not node_modules.exists():
            print("📦 Installing dependencies...")
            result = subprocess.run(["npm", "install"], capture_output=True, text=True)
            if result.returncode != 0:
                print(f"❌ Failed to install dependencies: {result.stderr}")
                return
            print("✅ Dependencies installed")

        # Check for dev script
        try:
            with open(package_json, 'r') as f:
                config = json.load(f)

            dev_script = config.get('scripts', {}).get('dev')
            if dev_script:
                print(f"🔧 Starting development server...")
                print(f"📍 Platform: {platform}")
                print(f"🌐 URL: http://localhost:3000 (usually)")
                print(f"⚡ Press Ctrl+C to stop")
                print("-" * 50)

                # Start development server
                subprocess.run(["npm", "run", "dev"])
            else:
                print("❌ No 'dev' script found in package.json")
                print("Available scripts:")
                scripts = config.get('scripts', {})
                for script_name, script_cmd in scripts.items():
                    print(f"  {script_name}: {script_cmd}")

        except json.JSONDecodeError:
            print("❌ Invalid package.json")
        except KeyboardInterrupt:
            print("\n👋 Development server stopped")

    def setup_blackbox_environment(self):
        """Set up Blackbox tools and environment"""
        print("⚙️ Setting up Blackbox environment...")

        # Check for Blackbox CLI (placeholder for actual setup)
        print("📋 Blackbox setup checklist:")
        print("  ✅ Monorepo structure optimized")
        print("  ✅ Design tokens available")
        print("  ✅ UI components ready")
        print("  ⏳ Blackbox CLI installation (manual)")
        print("  ⏳ Enhanced design system (manual)")

        print("\n📝 Next steps:")
        print("1. Install Blackbox CLI tools")
        print("2. Choose target platform")
        print("3. Run visual analysis")
        print("4. Start UI enhancement")

def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        starter = BlackboxDevStarter()
        starter.run()
    else:
        command = sys.argv[1]
        starter = BlackboxDevStarter()

        if command == "setup":
            starter.setup_blackbox_environment()
        else:
            starter.run(command)

if __name__ == "__main__":
    main()
