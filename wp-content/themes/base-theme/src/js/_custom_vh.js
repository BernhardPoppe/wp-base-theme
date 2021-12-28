let customViewportCorrectionVariable = 'vh'

//Fix 100vh Problem:
const setViewportProperty = (doc) => {
	let prevClientHeight
	let customVar = '--' + ( customViewportCorrectionVariable || 'vh' )
	const handleResize = () => {
		let clientHeight = doc.clientHeight
		if (clientHeight === prevClientHeight) return
		requestAnimationFrame(function updateViewportHeight(){
			doc.style.setProperty(customVar, (clientHeight * 0.01) + 'px')
			prevClientHeight = clientHeight
		})
	}
	handleResize()
	return handleResize
}

window.addEventListener('resize', setViewportProperty(document.documentElement))
window.addEventListener('orientationchange', setViewportProperty(document.documentElement))