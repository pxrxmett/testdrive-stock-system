export default {
  ssr: false,
  
  head: {
    title: 'Isuzu Test Drive Queue Management System',
    htmlAttrs: {
      lang: 'th'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'ระบบจัดการคิวทดลองขับรถ Isuzu' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        href: 'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&family=Kanit:wght@300;400;500;600;700&display=swap',
        rel: 'stylesheet'
      }
    ]
  },

  css: [
    '~/assets/css/custom.css'
  ],

  plugins: [
    '~/plugins/api.js',
    '~/plugins/auth-init.js'
  ],

  components: true,

  buildModules: [
    '@nuxtjs/tailwindcss'
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'cookie-universal-nuxt'
  ],

  axios: {
    baseURL: process.env.API_URL || 'http://localhost:3000/api'
  },

  pwa: {
    manifest: {
      name: 'Isuzu Test Drive Queue System',
      short_name: 'Isuzu Queue'
    }
  },

  serverMiddleware: [
    '~/server/api/index.js'
  ],

  server: {
    port: process.env.PORT || 8080,
    host: process.env.HOST || 'localhost'
  },

  router: {
    middleware: ['auth', 'redirect-legacy']
  },

  build: {}
}