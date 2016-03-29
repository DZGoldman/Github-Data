
var skillHelpersHash ={
  getUsersSkills: function(error, response, data, user, userIndex, len,getSkills, errorCounter) {
      if (error) {
        throw error
      };
      var status = response.statusCode;
      if (status >= 200 && status <= 299) {
        var repos = JSON.parse(data);
        var skills = skillHelpersHash.getLanguages(repos);
        user.update({skills: skills, skills_found: true})
          .then(function() {
            console.log('user updated', userIndex);
            skillHelpersHash.recurIfNotDone(userIndex, len, getSkills)
          })
      } else {
        errorCounter++
        user.update({
            skills_found: true
          })
        skillHelpersHash.recurIfNotDone(userIndex, len, getSkills)
      }
    },
  //Takes in API response object of a user's repo, outputs an array of the user's languages
  getLanguages: function (repos) {
   var skills = [];
  var languagesHash ={};
   repos.forEach(function (repo) {
     var language = repo.language;
     if (language && !languagesHash[language] ) {
       languagesHash[language]=true
     }
   }) //end for each repo
   for (language in languagesHash){
     skills.push(language)
   }
   return skills
 },
 //Checks to see if scraping is finished; if not, scrapes next element (recursively)
 recurIfNotDone: function (userIndex, len, cb) {
   if (userIndex < len - 1) {
     cb(userIndex + 1)
   }else{
     console.log('done with scrape');
   }
 }
}

module.exports =skillHelpersHash;