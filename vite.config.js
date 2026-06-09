import { defineConfig } from 'vite';
import { resolve } from 'path';
import {
  copyFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { build as esbuildBuild } from 'esbuild';

const __dirname = resolve();
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));

function getMinChromeVersion() {
  const browserslist = pkg.browserslist || [];
  for (const entry of browserslist) {
    const match = String(entry).match(/chrome\s*>=\s*(\d+)/i);
    if (match) return match[1];
  }
  return null;
}

function copyDirPlugin(srcDir, outDir, isProd) {
  return {
    name: 'copy-dir',
    async closeBundle() {
      const copy = (src, dest) => {
        if (!existsSync(src)) return;
        const stat = statSync(src);
        if (stat.isDirectory()) {
          if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
          for (const file of readdirSync(src)) {
            copy(resolve(src, file), resolve(dest, file));
          }
        } else {
          mkdirSync(resolve(dest, '..'), { recursive: true });
          if (src.endsWith('manifest.json')) {
            const manifest = JSON.parse(readFileSync(src, 'utf-8'));
            const oldVersion = manifest.version;
            const oldMinChrome = manifest.minimum_chrome_version;
            manifest.version = isProd ? pkg.version : oldVersion;
            const minChrome = getMinChromeVersion();
            if (minChrome) manifest.minimum_chrome_version = minChrome;
            writeFileSync(dest, JSON.stringify(manifest, null, 2) + '\n');
            console.log(`  manifest: version ${oldVersion} → ${manifest.version}` +
              (minChrome && oldMinChrome !== minChrome
                ? `, minimum_chrome_version ${oldMinChrome} → ${minChrome}`
                : ''));
          } else {
            copyFileSync(src, dest);
          }
        }
      };
      copy(resolve(__dirname, srcDir), resolve(__dirname, outDir));

      const bgPath = resolve(__dirname, outDir, 'background.js');
      if (existsSync(bgPath)) {
        const result = await esbuildBuild({
          entryPoints: [bgPath],
          outfile: bgPath,
          bundle: false,
          minify: isProd,
          target: 'chrome88',
          legalComments: 'none',
          allowOverwrite: true,
        });
        if (result.warnings.length > 0) {
          console.warn('  background.js warnings:', result.warnings);
        }
      }
    },
  };
}

const isProd = process.env.NODE_ENV === 'production';
const outDir = isProd ? 'dist' : 'test';

export default defineConfig({
  build: {
    outDir,
    emptyOutDir: true,
    minify: false,
    sourcemap: !isProd,
    target: 'chrome88',
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'source/background.js'),
      },
      output: {
        entryFileNames: '[name].js',
        format: 'iife',
      },
    },
  },
  plugins: [
    copyDirPlugin('source', outDir, isProd),
  ],
});
