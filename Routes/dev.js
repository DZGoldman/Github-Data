var skillsHelpers = require('../Helpers/skills-helpers.js');

module.exports.controller = function(app, User, Github_User) {

  //route for testing thiings out
app.get('/playground', function(req, res) {
  console.log('playground route');

});

counter =1
  app.get('/transfer', function(req, res) {
   if (counter>1) {
     console.log('NO!');
     console.log(counter);
     return
   }
   counter++
    User.all().then(function(users) {
      var oldUsers = users

      var len = oldUsers.length;
      console.log('length?', len);

      function transferUser(index) {
        var currentOldUser = oldUsers[index];
        var newGithubUser = Github_User.build();

        newGithubUser.username= currentOldUser.username
        newGithubUser.email= currentOldUser.email
        newGithubUser.giturl= currentOldUser.giturl
        newGithubUser.location= currentOldUser.location
        newGithubUser.latitude= currentOldUser.latitude
        newGithubUser.longitude= currentOldUser.longitude
        newGithubUser.distance_from_lt= currentOldUser.distance_from_lt
        newGithubUser.sent_boolean= currentOldUser.sent_boolean
        newGithubUser.skills= currentOldUser.skills
        newGithubUser.skills_found= currentOldUser.skills_found
          newGithubUser.save()
          .then(function() {
            console.log('saved user ', newGithubUser.id);
            if (index < len - 1) {
              transferUser(index + 1)
            } else {
              console.log('all done');
            }

          })
          .catch(function(err) {
            console.log('SOMETHING WENT WRONG');
            console.log(err);
            if(index<len-1) transferUser(index+1)
          })
      //
      }
      transferUser(0)

    })
  })
}
