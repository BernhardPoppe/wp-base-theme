import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { homedir } from 'os'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..', '..', '..')
const ENV_PATH = join(ROOT, '.env')

if (!existsSync(ENV_PATH)) {
	console.error('\n  ✗ Keine .env gefunden. Vorlage: cp .env.example .env\n')
	process.exit(1)
}

dotenv.config({ path: ENV_PATH, quiet: true })

function expandHome(filePath) {
	return filePath.startsWith('~') ? filePath.replace(/^~/, homedir()) : filePath
}

function buildSshCommand() {
	if (process.env.SSH_HOST) {
		return `ssh ${process.env.SSH_HOST}`
	}

	const { SFTP_HOST, SFTP_USER, SFTP_PORT, SFTP_PRIVATE_KEY } = process.env

	if (!SFTP_HOST || !SFTP_USER) {
		console.error('\n  ✗ SFTP_HOST und SFTP_USER in .env eintragen.\n')
		process.exit(1)
	}

	const args = ['ssh', '-p', SFTP_PORT || '22']

	if (SFTP_PRIVATE_KEY) {
		args.push('-i', expandHome(SFTP_PRIVATE_KEY))
	}

	args.push(`${SFTP_USER}@${SFTP_HOST}`)

	if (!SFTP_PRIVATE_KEY && !process.env.SFTP_PASSWORD) {
		console.warn('\n  · Kein SFTP_PASSWORD gesetzt – Passwort wird interaktiv abgefragt.\n')
	}

	return args.map(arg => (/\s/.test(arg) ? JSON.stringify(arg) : arg)).join(' ')
}

execSync(buildSshCommand(), { stdio: 'inherit', shell: true })
