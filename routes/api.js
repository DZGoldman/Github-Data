var apiCalls = require('../Helpers/api-calls.js')
var skillsHelpers = require('../Helpers/skills-helpers.js')

module.exports.controller =  function (app, User) {


  app.get('/api/repos/username/:username',function (req,res) {
    var userName = req.params.username.trim();
    apiCalls.getReposByGitName(userName)
    .then(function (data) {
        res.send(data)
      })
    .catch(function (data) {
        res.send(data)
      })
  });


  app.get('/api/skillsbasic/username/:username', function (req,res) {
    var userName = req.params.username.trim();
    function getLangList (data) {
      var repos = JSON.parse(data);
      var languages = skillsHelpers.getLanguages(repos)
      res.send(languages)
    }

    apiCalls.getReposByGitName(userName)
      .then(getLangList)
    //catch error

    .catch(function (error) {
      res.send(error)
    })
  });

  app.get('/api/skillscomplex/username/:username', function (req,res) {
    var userName = req.params.username.trim();
    apiCalls.getReposByGitName(userName)
    .then(function (data) {
        var repoArray = JSON.parse(data)
        var languageHash = {};
        skillsHelpers.getAllLanguageBytes(repoArray,languageHash, res, 0)
      })
  })


  app.get('/api/repos/email/:email', function (req, res) {
    var email = req.params.email.trim();
    function getRepos(data) {
      var result = JSON.parse(data)
      var handle = result.items[0].login
      return apiCalls.getReposByGitName(handle)
    }
    apiCalls.getUserByEmail(email)
      .then(getRepos)
      .then(function (data) {
          res.send(data)
        })
    //catch error
    .catch(function (data) {
        res.send(data)
      });
    //get Reops (hoist)
  });







} // end module
