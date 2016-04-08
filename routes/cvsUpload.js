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

  app.post('/getMatches', function (req, res) {
    var jobsArray = req.body.jobsArray;
    var talentArray = req.body.talentArray;
    CSVHelpers.cleanUpJobCSV(jobsArray);
    CSVHelpers.cleanUpJobCSV(talentArray)
    jobsArray.forEach(function (job, jobIndex) {
      //for Each job, iterate through each potential talent
      talentArray.forEach(function (talent, talentIndex) {
        //get number of skills matches between job and talent for each talent
        var count = CSVHelpers.getMatchCount(job.skills, talent.skills);
        talent.count = count;
      })

      var sortedTalent = CSVHelpers.sortByCount(talentArray);
      var lastIndex = sortedTalent.length;
      var desiredMatches = 3;
      var topMatches = sortedTalent.slice(lastIndex-desiredMatches, lastIndex+1);
      console.log(topMatches);
      res.send('done')
      //gives top matches to Job data:
      topMatches.forEach(function (talent, index) {
        var key = 'Match '+(index+1)
        job[key] = 'EMAIL: '+ talent.email +'   '+ talent.count+ ' SKILL MATCHES: ' + String(talent.skills)
      })
      //sort talents by count, grab top 5, give to Jobs Array
    })
    CSVHelpers.saveMatchesAsCSV(jobsArray, res)
  });

} // end module
