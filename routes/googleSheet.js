var  skillHelpers = require ('../Helpers/skills-helpers.js'),
sheetHelpers = require ('../Helpers/sheet-helpers.js'),
  appHelpers = require ('../Helpers/app-helpers.js'),
  requestOptions = appHelpers.requestOptions,
  request = require('request');
  module.exports.controller =  function (app, User) {

reqCount = 0;
app.get('/sheet/:count', function(req, res) {
  if (reqCount == 0) {
    reqCount++

    var count = +req.params.count
      // retrieve JSON from google docs file (20000 at a time:)
    var urls = sheetHelpers.urls
    request({url: urls[count],json: true},
      function(error, response, data) {
        if (error) {
          throw error
        }
        // get array of all users (all rows in google docs)
        var usersArray = data.feed.entry, len = usersArray.length, failCounter = 0;
        // recursive: for each row, create new User, give appropriate attributes (need case statement b/c JSON.parse isn't working!) and then save into DB. Upon successful save, move on to next row.
        function saveUser(index) {
          var infoArray = usersArray[index].content['$t'].split(', ');
          var user = User.build();
          sheetHelpers.buildUser(infoArray, user)
          User.count().then(function(c) {
            if (index < len - 1) {
              user.save()
                .then(function() {
                  return saveUser(index + 1)
                })
                .catch(function(error) {
                  console.log('Failed!', error);
                  failCounter++
                  if (index < len - 1) {
                    return saveUser(index + 1)
                  };
                })
            } else {
              console.log('# of times you failed:', failCounter);
            }
          })
        } //end save user
        (saveUser(0))
      }); // end of request
  } //end if

})
}
