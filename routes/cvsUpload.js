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
        //when finished, send all error messages back to the browser
        res.send(errors)
      }
    };

    saveUser(usersArray, 0)
  })


  app.post('/export-csv/:option', function (req, res) {
    //options: save or send
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
          var option = req.params.option;
          if(option=='save')
            {CSVHelpers.saveAsCSV(usersArray, res)}
          else if (option=='send') {
            CSVHelpers.sendToClient(usersArray, res)
          }

      }
    };

  })

  app.post('/compare', function (req, res) {
    var jobsArray = req.body.data;

    jobsArray.forEach(function (job) {
      var skills = job.Skills
      skills= skills.substring(1, skills.length-1);
      skills= skills.replace(/"/g,"");
      skills= skills.split(',');
      job.Skills = skills;
    });

    res.send(jobsArray)
  }

  )

} // end module
