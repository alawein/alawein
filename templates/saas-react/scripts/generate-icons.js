#!/usr/bin/env node
import { writeFileSync } from 'fs';

const generateSVG = (size, letter = 'A') => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#000"/>
  <text x="50%" y="50%" font-size="${size * 0.6}" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-family="system-ui, -apple-system">${letter}</text>
</svg>`;

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 }
];

sizes.forEach(({ name, size }) => {
  writeFileSync(`public/${name.replace('.png', '.svg')}`, generateSVG(size));
});

console.log('✅ Icon templates generated. Convert SVG to PNG using: npx @squoosh/cli --webp auto public/*.svg');
