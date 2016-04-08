var json2csv = require('json2csv');
var fs = require('fs');
var natural = require('natural');


module.exports = {
    //Takes in array of objects, converts to CSV file, save at path
    saveAsCSV: function(data, path, res) {
      json2csv({data: data}, function(err, csv) {
        if (err) console.log(err);
        fs.writeFile(path, csv, function(err) {
          if (err) throw err;
          console.log('file saved');
          res.send(['done'])
        })
      });
    },

    //same as above, except instead of saving, sends the CSV data back to client (NOTE: not currently used?)
    sendToClient: function(usersArray, res) {
      json2csv({data: usersArray}, function(err, csv) {
        if (err) console.log(err);
        res.send(usersArray)
      });
    },

    //convert skills string 'array' into JS array object
    cleanUpSkills: function (jobsArray) {
      jobsArray.forEach(function (job) {
        var skills = job.skills
        //remove brackets
        skills= skills.substring(1, skills.length-1);
        //removes quotes
        skills= skills.replace(/"/g,"");
        //split into array
        skills= skills.split(',');
        job.skills = skills.sort();
      });
    },

    //Inputs two string arrays, outputs number of matches
    getMatchCount: function (jobSkills, talentSkills) {
      var jobIndex = 0, talentIndex = 0;
      var jobSkillsLen = jobSkills.length, talentSkillsLen = talentSkills.length;
      var matchCount = 0;
      while ( (jobIndex < jobSkillsLen) && (talentIndex < talentSkillsLen) ) {
        // Elastic matching with natural JS: if current strings are 'equal'
        if (natural.JaroWinklerDistance( jobSkills[jobIndex].toLowerCase(),talentSkills[talentIndex].toLowerCase() )>0.8) {
          //count as match, increment both arrays
          matchCount++;
          jobIndex++;
          talentIndex++
          // if job is behind talent alphabetically, increment job
        }else if (jobSkills[jobIndex] < talentSkills[talentIndex]) {
          jobIndex++
          // if talent is behind, increment talent
        }else if (jobSkills[jobIndex] > talentSkills[talentIndex]) {
          talentIndex++
        }
      }
      return matchCount
    },
    // helper function to sort array of objects by count property
    sortByCount: function (talentArray) {
    var sorted =  talentArray.sort(function(a, b){
      return a.count == b.count ? 0 : +(a.count > b.count) || -1;
    });
    return sorted
  }

  } // end module
