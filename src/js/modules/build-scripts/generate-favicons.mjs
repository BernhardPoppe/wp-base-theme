/**
 * Generates all favicon variants from a single source image.
 *
 * Source: graphics/favicon/favicon-source.svg
 * Output: graphics/favicon/generated/
 *
 * Usage: npm run favicons
 */

import { favicons } from 'favicons'
import { logBuild } from './build-log.mjs'
import { writeFile, mkdir, rm, readFile, access } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createHash } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..', '..', '..')
const SOURCE = join(ROOT, 'graphics', 'favicon', 'favicon-source.svg')
const OUTPUT_DIR = join(ROOT, 'graphics', 'favicon', 'generated')
const HASH_FILE = join(OUTPUT_DIR, '.source-hash')

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

const force = process.argv.includes('--force')

async function computeHash() {
	const source = await readFile(SOURCE)
	return createHash('md5')
		.update(source)
		.update(JSON.stringify(config))
		.digest('hex')
}

async function isUpToDate(hash) {
	try {
		await access(join(OUTPUT_DIR, 'head-tags.html'))
		const previous = await readFile(HASH_FILE, 'utf-8')
		return previous.trim() === hash
	} catch {
		return false
	}
}

async function generate() {
	const hash = await computeHash()

	if (!force && await isUpToDate(hash)) {
		logBuild('Favicons up to date (source unchanged)')
		return
	}

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
	await writeFile(HASH_FILE, hash)

	logBuild(`Favicons generated (${response.images.length} files)`)
}

generate().catch((err) => {
	console.error('Error generating favicons:', err.message)
	process.exit(1)
})
