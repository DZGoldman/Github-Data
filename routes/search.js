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
        var resultsCSV = [];
        limit = Math.min(limit, data.total_count);
        console.log('limit', limit);
        function createRow(index) {
          var userResult = data.items[index];
          var userCSV = {};
          userCSV.giturl = userResult.html_url;
          apiCalls.goToUrl(userResult.url)
            .then(function(data) {
              var data = JSON.parse(data);
              userCSV.username = data.name;
              userCSV.location = data.location;
              if (data.email) userCSV.email = data.email;
              apiCalls.getReposByGitName(userResult.login)
              .then(function (data) {
                var repos = JSON.parse(data)
                var skills = skillsHelpers.getLanguages(repos);
                userCSV.skills = skills;
                resultsCSV.push(userCSV);


                // at repos
              if (index < limit-1) {
                return createRow(index + 1)
              } else {
                CSVHelpers.saveAsCSV(resultsCSV, './Public/docs/search-results.csv', res)
              }

              })




            })
            .catch(function(error) {
              throw error
            })

        };
        createRow(0)
      })
      .catch(function(error) {
        throw error
      })

  })




  app.get('/searchusers/:lang/:loc', function(req, res) {
    var language = req.params.lang;
    var location = req.params.loc
    apiCalls.searchUsers(language, location)
      .then(function(data) {
        res.send(data)
      })
      .catch(function(error) {
        res.send(error)
      })

  })

}
