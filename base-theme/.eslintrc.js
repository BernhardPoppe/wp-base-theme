module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es2021': true,
		'jquery': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 12,
		'sourceType': 'module'
	},
	'rules': {
		'no-trailing-spaces': 'error',
		'object-curly-spacing':
		['error','always'],
		'arrow-spacing': [
			'error', { 'before': true, 'after': true }
		],
		'eqeqeq': 'error',
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		'no-console': 0
	}
}
