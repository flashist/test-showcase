module.exports = {
	swDest: 'dist/sw.js',
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{html,js,css,png,jpg,jpeg,gif,svg,woff,woff2,eot,ttf,otf,json,mp3,webm}'
	],
	runtimeCaching: [{
		urlPattern: 'https://dolbyrev.com/games/luck-be-a-slot-machine-operator/*',
		handler: 'StaleWhileRevalidate'
	}]
};