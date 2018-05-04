const alexa = require('alexa-app')

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1

// Define an alexa-app
const app = new alexa.app('umahuesla')
app.id = require('./package.json').alexa.applicationId

app.launch(function(req, res) {
  res.say('Hello World!!')
})

app.intent('FeedIntent', function(req, res) {
  res.say('lets fetch data')
})

module.exports = app
