var apiCalls = require('../Helpers/api-calls.js');

module.exports.controller = function(app, User) {

  app.get('/searchusers/:lang/:loc', function(req, res) {
    var language = req.params.lang;
    var location = req.params.loc
    apiCalls.searchUsers(language, location )
    .then(function (data) {
      res.send(data)
    })

  })

}
