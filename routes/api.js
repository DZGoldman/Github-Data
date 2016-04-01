var apiCalls = require('../Helpers/api-calls.js')

module.exports.controller =  function (app, User) {

  app.get('/api/user/:username',function (req,res) {
    var userName = req.params.username.trim();
    apiCalls.getUserByGitName(userName)
    res.send('apitest')
  })


}
