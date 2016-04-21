var apiCalls = require('../Helpers/api-calls.js');

module.exports.controller = function(app, User) {

  app.post('/searchusers', function(req, res) {
    var language = req.body.language;
    var location = req.body.location;
    var limit = req.body.limit;

    //search github api based on parameters:
    apiCalls.searchUsers(language, location)
      .then(function(data) {
        var resultsCSV = [];
        //TODO
        limit = Math.min(limit, data.totalItems);

        function createRow(index) {
          //toDO
          // data[index] ...




          if (index<limit) {
            createRow(index+1)
          }else{
            CSVHelpers.saveAsCSV(resultsCSV, './Public/docs/search-results.csv', res)
          }
        };

        createRow(0)






      })
      .catch(function(error) {
        res.send(error)
      })

  })

}
