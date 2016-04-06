var apiCalls = require('../Helpers/api-calls.js')
var skillsHelpers = require('../Helpers/skills-helpers.js')

module.exports.controller =  function (app, User) {

  //Get current rate limit status (5000 calls per hour)
  app.get('/api/ratelimit', apiCalls.rateLimit);

  app.get('/api/getReposByUsername/:username',function (req,res) {
    //username is route parameter:
    var userName = req.params.username.trim();
    //request repos from api:
    apiCalls.getReposByGitName(userName)
    .then(function (data) {
        res.send(data)
      })
    .catch(function (data) {
        res.send(data)
      })
  });

//Skills List: List of primary lanugages in all of the user's repos:
  app.get('/api/getSkillsListByUsername/:username', function (req,res) {
    var userName = req.params.username.trim();
    function getLangList (repoData) {
      var repos = JSON.parse(repoData);
      var languages = skillsHelpers.getLanguages(repos)
      res.send(languages)
    };
      //request repos from api:
    apiCalls.getReposByGitName(userName)
    //get primary lanugages for each repo
      .then(getLangList)
    //catch error

    .catch(function (error) {
      res.send(error)
    })
  });

//Skills hash: Hash of total bytes of each language in all of user's repos
  app.get('/api/getSkillsHashByUsername/:username', function (req,res) {
    var userName = req.params.username.trim();
    //request repos from api:
    apiCalls.getReposByGitName(userName)
    .then(function (repos) {
      //build out a language hash from the repos JSON
        var repoArray = JSON.parse(repos)
        var languageHash = {};
        skillsHelpers.getAllLanguageBytes(repoArray,languageHash, res, 0)
      })
  })

  app.get('/api/getReposByEmail/:email', function (req, res) {
    var email = req.params.email.trim();
    //Perform search by email from API
    apiCalls.getUserByEmail(email)
    //get User's repos
      .then(skillsHelpers.getRepos)
      .then(function (data) {
          res.send(data)
        })
    //catch error
    .catch(function (data) {
        res.send(data)
      });
  });

  app.get('/api/getSkillsListByEmail/:email', function (req, res) {
    var email = req.params.email.trim();
        //Perform search by email from API
    apiCalls.getUserByEmail(email)
      // get User's repos
      .then(skillsHelpers.getRepos)
      // get language list by iterating through each repo:
      .then( function (repoData) {
        var repos = JSON.parse(repoData);
        var languages = skillsHelpers.getLanguages(repos)
        res.send(languages)
      })
    //catch error
    .catch(function (data) {
        res.send(data)
      });
  });

  app.get('/api/getSkillsHashByEmail/:email', function (req, res) {
    var email = req.params.email.trim();
    //Perform search by email from API
    apiCalls.getUserByEmail(email)
    // get User's repos
      .then(skillsHelpers.getRepos)
      //build out a language hash from the repos JSON
      .then( function (data) {
          var repoArray = JSON.parse(data)
          var languageHash = {};
          skillsHelpers.getAllLanguageBytes(repoArray,languageHash, res, 0)
        })
    //catch error
    .catch(function (data) {
        res.send(data)
      });
  });




} // end module
