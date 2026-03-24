/**
 * Initializes a new project from the base theme.
 * Asks for project name and updates all relevant files.
 *
 * Usage: npm run init
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createInterface } from 'readline'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..', '..', '..')

function ask(question) {
	const rl = createInterface({ input: process.stdin, output: process.stdout })
	return new Promise(resolve => {
		rl.question(question, answer => {
			rl.close()
			resolve(answer.trim())
		})
	})
}

function replaceInFile(filePath, replacements) {
	let content = readFileSync(filePath, 'utf-8')
	for (const [search, replace] of replacements) {
		content = content.replaceAll(search, replace)
	}
	writeFileSync(filePath, content)
}

function removeInitScript(pkgPath) {
	const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
	delete pkg.scripts.init
	writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

async function init() {
	console.log('\n  Theme initialisieren\n')

	const name = await ask('  Projektname (z.B. "Mein Projekt"): ')
	if (!name) {
		console.log('  Abgebrochen – kein Name eingegeben.')
		process.exit(0)
	}

	const slug = name.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/^-|-$/g, '')
	const underscore = slug.replace(/-/g, '_')

	console.log(`\n  Name:    ${name}`)
	console.log(`  Slug:    ${slug}`)
	console.log(`  Package: ${underscore}\n`)

	const confirm = await ask('  Korrekt? (j/n): ')
	if (confirm.toLowerCase() !== 'j') {
		console.log('  Abgebrochen.')
		process.exit(0)
	}

	console.log('')

	replaceInFile(join(ROOT, 'style.css'), [
		['Theme Name: Base Theme', `Theme Name: ${name}`],
		['Description: Poppe Base Theme', `Description: ${name}`],
	])
	console.log('  ✓ style.css')

	const pkgPath = join(ROOT, 'package.json')
	replaceInFile(pkgPath, [
		// eslint-disable-next-line quotes
		['"name": "base_theme"', `"name": "${underscore}"`],
		// eslint-disable-next-line quotes
		['"description": "Poppe Base Theme"', `"description": "${name}"`],
	])
	removeInitScript(pkgPath)
	console.log('  ✓ package.json')

	replaceInFile(join(ROOT, 'src/js/modules/build-scripts/generate-favicons.mjs'), [
		['appName: \'\'', `appName: '${name}'`],
		['appShortName: \'\'', `appShortName: '${slug}'`],
	])
	console.log('  ✓ generate-favicons.mjs')

	console.log('\n  Nächste Schritte:')
	console.log('    1. npm install')
	console.log('    2. Favicon-Quelle in graphics/favicon/favicon-source.svg ersetzen')
	console.log('    3. Farben & Fonts in theme.json anpassen')
	console.log('    4. npm run build\n')
}

init().catch(err => {
	console.error('Fehler:', err.message)
	process.exit(1)
})
