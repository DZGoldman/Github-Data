var apiCalls = require('../Helpers/api-calls.js');

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

              



            })
            .catch(function(err) {
              console.log('error????', err);
            })
            // at repos
          if (index < limit) {
            createRow(index + 1)
          } else {
            CSVHelpers.saveAsCSV(resultsCSV, './Public/docs/search-results.csv', res)
          }
        };

        createRow(0)






      })
      .catch(function(error) {
        res.send(error)
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
