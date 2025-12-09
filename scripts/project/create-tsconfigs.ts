import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const packages = [
  'api-schema',
  'design-tokens',
  'eslint-config',
  'feature-flags',
  'infrastructure',
  'monitoring',
  'prettier-config',
  'security-headers',
  'shared-ui',
  'typescript-config',
  'vite-config',
];

const baseTsConfig = {
  extends: '../../packages/config/typescript/base.json',
  compilerOptions: {
    composite: true,
    incremental: true,
    outDir: './dist',
    rootDir: './src',
    declaration: true,
    declarationMap: true,
    tsBuildInfoFile: './dist/.tsbuildinfo',
  },
  include: ['src/**/*'],
  exclude: ['node_modules', 'dist', '**/*.test.*', '**/*.spec.*'],
};

packages.forEach((pkg) => {
  const pkgPath = join(process.cwd(), 'packages', pkg);
  const tsconfigPath = join(pkgPath, 'tsconfig.json');

  if (!existsSync(tsconfigPath)) {
    // Create src directory if it doesn't exist
    const srcPath = join(pkgPath, 'src');
    if (!existsSync(srcPath)) {
      mkdirSync(srcPath, { recursive: true });
      // Create index.ts
      writeFileSync(join(srcPath, 'index.ts'), '// Package entry point\nexport {};\n');
    }

    writeFileSync(tsconfigPath, JSON.stringify(baseTsConfig, null, 2));
    console.log(`✅ Created tsconfig.json for ${pkg}`);
  } else {
    console.log(`⏭️  Skipped ${pkg} (tsconfig.json already exists)`);
  }
});

console.log('\n✨ Done!');
