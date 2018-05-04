// import the files
const AlexaAppServer = require('alexa-app-server')
const dotenv = require('dotenv')

// load environment variables (.env)
dotenv.load()

// create the server and define the environment
const serverPort = process.env.ALEXA_SERVER_PORT || '3000'
const serverDomain = process.env.ALEXA_SERVER_DOMAIN || 'localhost'
const isDevelopment = process.env.NODE_ENV !== 'production'

// setup the sever object
const server = new AlexaAppServer({
  app_dir: 'apps', // Location of alexa-app modules
  app_root: '/alexa/', // Service root
  debug: isDevelopment,
  log: isDevelopment,
  public_html: 'public_html', // Static content
  port: serverPort,
  server_root: __dirname, // Path to root
  verify: !isDevelopment,
})

// start the server
server.start()

// probe status url
server.express.use('/probe_status', function(req, res) {
  res.send('OK')
})
