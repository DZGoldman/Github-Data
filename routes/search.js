var apiCalls = require('../Helpers/api-calls.js');

module.exports.controller = function(app, User) {

  app.get('/searchusers', function(req, res) {
    var language = req.body.language;
    var location = req.body.location;
    var limit    = req.body.limit;
    apiCalls.searchUsers(language, location )
    .then(function (data) {
      res.send(data)
    })
    .catch(function (error) {
        res.send(error)
      })

  })

}
