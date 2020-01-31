export default {
	mode: 'universal',
	/*
  ** Headers of the page
  */
	head: {
		title: process.env.npm_package_name || 'L4US - Its Not a Badge, Its Family Crest',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
		],
		link: [ { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }, { rel: 'stylesheet', href: '' } ]
	},
	/*
  ** Customize the progress-bar color
  */
	loading: { color: '#fff', height: '4px' },
	loadingIndicator: { name: 'circle', color: '#fa923f' },
	/*
  ** Global CSS
  */
	css: [ '~/assets/css/main.css' ],
	/*
  ** Plugins to load before mounting the App
  */
	plugins: [ '~plugins/core-components.js', '~plugins/date-filter.js' ],
	/*
  ** Nuxt.js dev-modules
  */
	buildModules: [],
	/*
  ** Nuxt.js modules
  */
	modules: [],
	/*
  ** Build configuration
  */
	build: {
		/*
    ** You can extend webpack config here
    */
		extend(config, ctx) {}
	},
	env: {
		baseUrl: process.env.BASE_URL || 'https://l4us-8a0d4.firebaseio.com'
	},
	router: {
		linkActiveClass: 'active'
	},
	transition: {
		name: 'fade',
		mode: 'out-in'
	}
};
