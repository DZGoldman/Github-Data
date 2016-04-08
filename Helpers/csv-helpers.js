var json2csv = require('json2csv');
var fs = require('fs');

module.exports = {
    //Takes in array of objects, converts to CSV file
    saveAsCSV: function(usersArray, res) {
      json2csv({data: usersArray}, function(err, csv) {
        if (err) console.log(err);
        fs.writeFile('./Public/docs/github-skills.csv', csv, function(err) {
          if (err) throw err;
          console.log('file saved');
          res.send(['done'])
        })
      });
    },
    sendToClient: function(usersArray, res) {
      json2csv({data: usersArray}, function(err, csv) {
        if (err) console.log(err);
        res.send(usersArray)
      });
    },
    cleanUpJobCSV: function (jobsArray) {
      jobsArray.forEach(function (job) {
        var skills = job.skills
        skills= skills.substring(1, skills.length-1);
        skills= skills.replace(/"/g,"");
        skills= skills.split(',');
        job.skills = skills.sort();
      });
    },
    getMatchCount: function (jobSkills, talentSkills) {
      var jobIndex = 0, talentIndex = 0;
      var jobSkillsLen = jobSkills.length, talentSkillsLen = talentSkills.length;
      var matchCount = 0;
      // console.log(talentSkills, jobSkills);
      // console.log(typeof talentSkills[talentIndex], typeof jobSkills[jobIndex]);
      while ( (jobIndex < jobSkillsLen) && (talentIndex < talentSkillsLen) ) {

        if ( jobSkills[jobIndex] == talentSkills[talentIndex] ) {
          matchCount++;
          jobIndex++;
          talentIndex++
        }else if (jobSkills[jobIndex] < talentSkills[talentIndex]) {
          jobIndex++
        }else if (jobSkills[jobIndex] > talentSkills[talentIndex]) {
          talentIndex++
        }
      }
      console.log(matchCount);
      return matchCount
    }


  } // end module
