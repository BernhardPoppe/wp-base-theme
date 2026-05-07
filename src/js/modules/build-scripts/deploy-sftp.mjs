/**
 * Deploys the theme via SFTP, then runs git add/commit/push.
 *
 * Reads SFTP credentials from .env and ignore patterns from .deployignore
 * (gitignore-style). Uploads the project root to SFTP_REMOTE_PATH and skips
 * anything matched by the ignore list. After a successful upload, all changes
 * are staged, committed (only if something is staged), and pushed.
 *
 * Usage:
 *   npm run deploy             # build + upload + git commit/push
 *   npm run deploy:dry         # list files that would be uploaded, no transfer
 *
 * Flags:
 *   --dry, --dry-run           preview only, no SFTP / no git
 *   --no-git                   upload only, skip the git step
 *
 * Env:
 *   DEPLOY_COMMIT_MESSAGE      override commit message (default: "newbuild")
 */

import { readFileSync, existsSync, statSync, readdirSync } from 'fs'
import { join, dirname, relative, posix as pposix, sep } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import dotenv from 'dotenv'
import ignore from 'ignore'
import SftpClient from 'ssh2-sftp-client'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..', '..', '..')

dotenv.config({ path: join(ROOT, '.env'), quiet: true })

const DRY_RUN = process.argv.includes('--dry') || process.argv.includes('--dry-run')
const SKIP_GIT = process.argv.includes('--no-git')

const REQUIRED_ENV = ['SFTP_HOST', 'SFTP_USER', 'SFTP_REMOTE_PATH']
const missing = REQUIRED_ENV.filter(k => !process.env[k])
if (missing.length) {
	console.error('\n  ✗ Fehlende Variablen in .env:')
	for (const k of missing) console.error('    - ' + k)
	console.error('\n  Vorlage: .env.example -> .env kopieren und Werte eintragen.\n')
	process.exit(1)
}

if (!process.env.SFTP_PASSWORD && !process.env.SFTP_PRIVATE_KEY) {
	console.error('\n  ✗ Weder SFTP_PASSWORD noch SFTP_PRIVATE_KEY in .env gesetzt.\n')
	process.exit(1)
}

const config = {
	host: process.env.SFTP_HOST,
	port: Number(process.env.SFTP_PORT || 22),
	username: process.env.SFTP_USER,
}
if (process.env.SFTP_PASSWORD) config.password = process.env.SFTP_PASSWORD
if (process.env.SFTP_PRIVATE_KEY) {
	const keyPath = process.env.SFTP_PRIVATE_KEY.startsWith('~')
		? process.env.SFTP_PRIVATE_KEY.replace(/^~/, process.env.HOME || '')
		: process.env.SFTP_PRIVATE_KEY
	config.privateKey = readFileSync(keyPath)
	if (process.env.SFTP_PASSPHRASE) config.passphrase = process.env.SFTP_PASSPHRASE
}

const REMOTE_PATH = process.env.SFTP_REMOTE_PATH.replace(/\/+$/, '')

const ig = ignore()
const ignorePath = join(ROOT, '.deployignore')
if (existsSync(ignorePath)) {
	ig.add(readFileSync(ignorePath, 'utf-8'))
} else {
	console.warn('  ! Keine .deployignore gefunden – es werden alle Dateien hochgeladen.\n')
}

function toPosix(p) {
	return sep === '/' ? p : p.split(sep).join('/')
}

function walk(dir, files = []) {
	for (const name of readdirSync(dir)) {
		const abs = join(dir, name)
		const rel = toPosix(relative(ROOT, abs))
		const isDir = statSync(abs).isDirectory()
		const testPath = isDir ? rel + '/' : rel
		if (ig.ignores(testPath)) continue
		if (isDir) walk(abs, files)
		else files.push(rel)
	}
	return files
}

async function deploy() {
	const files = walk(ROOT).sort()
	const totalBytes = files.reduce((acc, f) => acc + statSync(join(ROOT, f)).size, 0)

	console.log('')
	console.log('  SFTP Deploy')
	console.log('  ───────────')
	console.log('  Host:    ' + config.host + ':' + config.port)
	console.log('  User:    ' + config.username)
	console.log('  Remote:  ' + REMOTE_PATH)
	console.log('  Files:   ' + files.length + ' (' + (totalBytes / 1024 / 1024).toFixed(2) + ' MB)')
	console.log('')

	if (DRY_RUN) {
		console.log('  Dry-Run – folgende Dateien würden übertragen:\n')
		for (const f of files) console.log('    ' + f)
		console.log('\n  ' + files.length + ' Dateien. Keine Übertragung.\n')
		return
	}

	const sftp = new SftpClient()
	const dirsCreated = new Set()

	try {
		await sftp.connect(config)

		let uploaded = 0
		for (const rel of files) {
			const local = join(ROOT, rel)
			const remote = pposix.join(REMOTE_PATH, rel)
			const remoteDir = pposix.dirname(remote)

			if (!dirsCreated.has(remoteDir)) {
				const exists = await sftp.exists(remoteDir)
				if (!exists) await sftp.mkdir(remoteDir, true)
				dirsCreated.add(remoteDir)
			}

			await sftp.fastPut(local, remote)
			uploaded++
			const pct = ((uploaded / files.length) * 100).toFixed(1).padStart(5)
			process.stdout.write('\r  [' + pct + '%] ' + rel.padEnd(60).slice(0, 60))
		}

		process.stdout.write('\r' + ' '.repeat(80) + '\r')
		console.log('  ✓ ' + uploaded + ' Dateien hochgeladen.\n')
	} catch (err) {
		console.error('\n  ✗ Deploy fehlgeschlagen: ' + err.message + '\n')
		process.exitCode = 1
		return
	} finally {
		await sftp.end()
	}

	if (!SKIP_GIT) gitCommitAndPush()
}

/**
 * Stages all changes, commits if anything is staged, then pushes.
 * Failures are logged but don't fail the overall deploy (SFTP already succeeded).
 */
function gitCommitAndPush() {
	console.log('  Git')
	console.log('  ───')
	try {
		execSync('git rev-parse --is-inside-work-tree', { cwd: ROOT, stdio: 'pipe' })
	} catch {
		console.log('  · kein Git-Repository – übersprungen.\n')
		return
	}

	try {
		execSync('git add -A', { cwd: ROOT, stdio: 'pipe' })

		let hasStaged = true
		try {
			execSync('git diff --cached --quiet', { cwd: ROOT, stdio: 'pipe' })
			hasStaged = false
		} catch {
			hasStaged = true
		}

		if (hasStaged) {
			const msg = process.env.DEPLOY_COMMIT_MESSAGE || 'newbuild'
			execSync('git commit -m ' + JSON.stringify(msg), { cwd: ROOT, stdio: 'pipe' })
			console.log('  ✓ commit: ' + msg)
		} else {
			console.log('  · keine Änderungen zu committen')
		}

		execSync('git push', { cwd: ROOT, stdio: 'pipe' })
		console.log('  ✓ git push abgeschlossen.\n')
	} catch (err) {
		const stderr = err.stderr ? err.stderr.toString().trim() : ''
		console.error('  ! Git-Schritt fehlgeschlagen' + (stderr ? ': ' + stderr : ''))
		console.error('    (SFTP-Upload war bereits erfolgreich.)\n')
	}
}

deploy().catch(err => {
	console.error('Fehler:', err.message)
	process.exit(1)
})
