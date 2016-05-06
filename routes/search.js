var apiCalls = require('../Helpers/api-calls.js'),
  skillsHelpers = require('../Helpers/skills-helpers.js'),
  CSVHelpers = require('../Helpers/csv-helpers.js')

module.exports.controller = function(app, User) {
  app.post('/searchusers', function(req, res) {
    var language = req.body.language;
    var location = req.body.location;
    var limit = req.body.limit;
    console.log(language, location, limit);
    //search github api based on parameters:
    apiCalls.searchUsers(language, location)
      .then(function(data) {
        var data = JSON.parse(data);
        var total = data.items.length
        var resultsCSV = [];
        //number of users is the limit the searcher provides or just the total
        limit = Math.min(limit, total);
        //stop if none are found
        if(limit<=0){
          res.send([false])
          return
        }
        //recursive function; creates row in the CSV file
        function createRow(index) {
          var userResult = data.items[index];
          //catches blank result for insurance, because sometimes Github's API is messy
          if (!userResult) console.log('error', index);
          var userCSV = {};
          //get git url from result
          userCSV.giturl = userResult.html_url;
          //hit url with api call
          apiCalls.goToUrl(userResult.url)
            .then(function(data) {
              //grab avaialble data
              var data = JSON.parse(data);
              if (data.name) userCSV.username = data.name;
              if (data.location) userCSV.location = data.location;
              //only save user if they have email available
              if (data.email) {
                userCSV.email = data.email
              } else {
                return recurIfNotDone()
              }
              //..including all skills!
              apiCalls.getReposByGitName(userResult.login)
                .then(function(data) {
                  var repos = JSON.parse(data)
                  var skills = skillsHelpers.getLanguages(repos);
                  console.log(skills);
                  userCSV.skills = skills;
                  //add to results array
                  resultsCSV.push(userCSV);
                  return recurIfNotDone()
                })
                .catch(function(error) {
                  throw error
                })
            })
            .catch(function(error) {
              throw error
            });

          function recurIfNotDone() {
            //if we haven't reached the limit and aren't past the total
            if ( (resultsCSV.length < limit)  && (index< total-1 ) ) {
              return createRow(index + 1)
            } else {
              CSVHelpers.saveAsCSV(resultsCSV, './Public/docs/search-results.csv', res)
            }
          }
        };
        createRow(0)
      })
      .catch(function(error) {
        throw error
      })

  })


}
