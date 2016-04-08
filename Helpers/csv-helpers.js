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
        var skills = job.Skills
        skills= skills.substring(1, skills.length-1);
        skills= skills.replace(/"/g,"");
        skills= skills.split(',');
        job.Skills = skills.sort();
      });
    }


  } // end module
