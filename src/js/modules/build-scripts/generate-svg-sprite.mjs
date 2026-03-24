/**
 * Combines all SVGs from graphics/svgs/ into a single hashed sprite.
 *
 * Source: graphics/svgs/*.svg
 * Output: graphics/svgs/generated/sprite.{hash}.svg
 *         graphics/svgs/generated/sprite-manifest.json
 *
 * Usage in PHP:
 *   <?php icon('arrow-right'); ?>
 *
 * Usage: npm run sprite
 */

import svgstore from 'svgstore'
import { logBuild } from './build-log.mjs'
import { createHash } from 'crypto'
import { readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync } from 'fs'
import { join, basename, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..', '..', '..')
const SVG_DIR = join(ROOT, 'graphics', 'svgs')
const OUTPUT_DIR = join(SVG_DIR, 'generated')

const files = readdirSync(SVG_DIR).filter(f => f.endsWith('.svg')).sort()

if (files.length === 0) {
	logBuild('SVG sprite skipped (no SVGs in graphics/svgs/)')
	process.exit(0)
}

const sprite = svgstore({
	cleanDefs: true,
	cleanSymbols: true,
	svgAttrs: {
		xmlns: 'http://www.w3.org/2000/svg',
		style: 'display:none',
	},
})

for (const file of files) {
	sprite.add(basename(file, '.svg'), readFileSync(join(SVG_DIR, file), 'utf-8'))
}

const svgContent = sprite.toString()
const hash = createHash('md5').update(svgContent).digest('hex').slice(0, 8)
const filename = `sprite.${hash}.svg`

rmSync(OUTPUT_DIR, { recursive: true, force: true })
mkdirSync(OUTPUT_DIR, { recursive: true })

writeFileSync(join(OUTPUT_DIR, filename), svgContent)
writeFileSync(join(OUTPUT_DIR, 'sprite-manifest.json'), JSON.stringify({ sprite: filename }))

logBuild(`SVG sprite generated (${files.length} icons → ${filename})`)
