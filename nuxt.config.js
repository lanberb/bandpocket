export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'BandPocket',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/firebase.js', ssr: false },
  ],

  env: {
    GUEST_MailAddress: process.env.GUEST_MailAddress || '',
    GUEST_Password: process.env.GUEST_Password || '',
    FIREBASE_ApiKey: process.env.FIREBASE_ApiKey || '',
    FIREBASE_AuthDomain: process.env.FIREBASE_AuthDomain || '',
    FIREBASE_ProjectID: process.env.FIREBASE_ProjectID || '',
    FIREBASE_StorageBucket: process.env.FIREBASE_StorageBucket || '',
    FIREBASE_MessagingSenderID: process.env.FIREBASE_MessagingSenderID || '',
    FIREBASE_AppID: process.env.FIREBASE_AppID || '',
    FIREBASE_MeasurementID: process.env.FIREBASE_MeasurementID || '',
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
  ],
  manifest: {
    icon: {
      source: '/favicon_copy.png'
    },
    name: "Drink!",
    title: "Drink!",
    'og:title': 'Drink!',
    description: 'いつもの一杯をもっとスマートに。生活のひとときをシームレスに。',
    'og:description': 'いつもの一杯をもっとスマートに。生活のひとときをシームレスに。',
    lang: 'ja',
    theme_color: "#ff7171",
    background_color: "#fff",
    scope: "/",
    start_url: "/"
  },

  webfontloader: {
    custom: {
      families: [
        'Comfortaa',
      ],
      urls: [
        "https://fonts.googleapis.com/css2?family=Comfortaa:wght@400&display=swap&text=BandPocket"
      ]
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
