/**
 * Generates all favicon variants from a single source image.
 *
 * Source: graphics/favicon/favicon-source.svg
 * Output: graphics/favicon/generated/
 *
 * Usage: npm run favicons
 */

import { favicons } from 'favicons'
import { writeFile, mkdir, rm } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..', '..', '..')
const SOURCE = join(ROOT, 'graphics', 'favicon', 'favicon-source.svg')
const OUTPUT_DIR = join(ROOT, 'graphics', 'favicon', 'generated')

const config = {
	path: '/graphics/favicon/generated/',
	appName: '',
	appShortName: '',
	appDescription: '',
	background: '#ffffff',
	theme_color: '#ffffff',
	lang: 'de',
	icons: {
		android: true,
		appleIcon: true,
		appleStartup: false,
		favicons: true,
		windows: false,
		yandex: false,
	},
}

async function generate() {
	const response = await favicons(SOURCE, config)

	await rm(OUTPUT_DIR, { recursive: true, force: true })
	await mkdir(OUTPUT_DIR, { recursive: true })

	for (const image of response.images) {
		await writeFile(join(OUTPUT_DIR, image.name), image.contents)
	}

	for (const file of response.files) {
		await writeFile(join(OUTPUT_DIR, file.name), file.contents)
	}

	await writeFile(join(OUTPUT_DIR, 'head-tags.html'), response.html.join('\n'))

	console.log(`Favicons generated (${response.images.length} files)`)
}

generate().catch((err) => {
	console.error('Error generating favicons:', err.message)
	process.exit(1)
})
