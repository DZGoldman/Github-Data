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
        limit = Math.min(limit, total);
        console.log('limit', 0);
        if(limit<=0){
          console.log('limit is 0');
          res.send([false])
          return
        }
        function createRow(index) {
          var userResult = data.items[index];
          if (!userResult) console.log('error', index);
          var userCSV = {};
          userCSV.giturl = userResult.html_url;
          apiCalls.goToUrl(userResult.url)
            .then(function(data) {
              var data = JSON.parse(data);
              if (data.name) userCSV.username = data.name;
              if (data.location) userCSV.location = data.location;
              if (data.email) {
                userCSV.email = data.email
              } else {
                return recurIfNotDone()
              }

              apiCalls.getReposByGitName(userResult.login)
                .then(function(data) {
                  var repos = JSON.parse(data)
                  var skills = skillsHelpers.getLanguages(repos);
                  console.log(skills);
                  userCSV.skills = skills;
                  resultsCSV.push(userCSV);
                  // at repos
                  return recurIfNotDone()


                })

            })
            .catch(function(error) {
              throw error
            });

          function recurIfNotDone() {
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
