/**
 * Terminal styling for build script output (aligned with Parcel-style blue).
 */

const brightBlue = '\u001b[94m'
const reset = '\u001b[0m'

export function logBuild(message) {
	console.log(`${brightBlue}${message}${reset}`)
}
