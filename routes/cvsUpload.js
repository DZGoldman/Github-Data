var skillsHelpers = require('../Helpers/skills-helpers.js');
var apiCalls = require('../Helpers/api-calls.js');
var CSVHelpers = require('../Helpers/csv-helpers.js')


module.exports.controller =  function (app, User) {

  app.post('/upload', function (req, res) {
    var usersArray = req.body.data;
    var len = usersArray.length;
    var index =0;
    var errors=[];

    function saveUser(usersArray, index) {
        //create new user for the database
      var dbUser = User.build();
      var csvUser = usersArray[index];
      //give user attributes from csv
      skillsHelpers.buildUserFromCSV(dbUser, csvUser);
      //retrieve user's username...
      var username = dbUser.giturl.split('https://github.com/')[1];
      //...so we can get their skills
      apiCalls.getReposByGitName(username)
      .then(function (repoStr) {
        var repos = JSON.parse(repoStr)
        var languages = skillsHelpers.getLanguages(repos)
        dbUser.skills = languages;
        //save user, and recur with next user in sheet
        dbUser.save()
      .then(function () {
          recurIfNotDone(len, index)
        })
      .catch(function (error) {
          console.log(error);
          errors.push(error.message+': '+error.errors[0].message);
          recurIfNotDone(len,index)
          })
      })
    };
    function recurIfNotDone(len, index) {
      if (index<len-1) {
        saveUser(usersArray, index+1)
      }else{
        console.log('endGame');
        res.send(errors)
      }
    };

    saveUser(usersArray, 0)
  })


  app.post('/export-csv', function (req, res) {
    var usersArray = req.body.data;
    var len = usersArray.length;
    var index =0;

    function addSkills(usersArray, index) {
      var csvUser = usersArray[index];
      var username = csvUser.giturl.split('https://github.com/')[1];
      apiCalls.getReposByGitName(username)
      .then(function (repoStr) {
        var repos = JSON.parse(repoStr)
        var languages = skillsHelpers.getLanguages(repos)
        console.log(languages);
        csvUser.skills = languages
        recurIfNotDone(len, index)
      })
    };

    addSkills(usersArray, 0)

    function recurIfNotDone(len, index) {
      if (index<len-1) {
        addSkills(usersArray, index+1)
      }else{
        CSVHelpers.saveAsCSV(usersArray, res)
      }
    };

  })
}
