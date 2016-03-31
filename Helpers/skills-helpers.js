
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
 },
 logTime: function () {
   var t = new Date()
   console.log(t.getHours(),t.getMinutes(),t.getSeconds())
 },

 distanceFromLt: function (lat2,lon2) {
     lat1= 40.742614;
     lon1= -73.991085;

     function toRadians(deg) {
       return deg*(Math.PI/180)
     }

     var R = 6371000; // metres
     var φ1 =toRadians(lat1);
     var φ2 =toRadians(lat2);
     var Δφ = toRadians(lat2-lat1);
     var Δλ = toRadians(lon2-lon1);

     var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
             Math.cos(φ1) * Math.cos(φ2) *
             Math.sin(Δλ/2) * Math.sin(Δλ/2);
     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

     var d = R * c;
    return Math.round(d/1000)
   }

}

module.exports =skillHelpersHash;
