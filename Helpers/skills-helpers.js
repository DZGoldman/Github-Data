var apiCalls = require('./api-calls.js')

//Helper functions for gathering user's skills:
var skillHelpersHash = {
  buildUserFromCSV: function (dbUser, csvUser) {
          for(key in csvUser){
            var value = csvUser[key]
            if (value) {
              dbUser[key] = value;
            }else{
              console.log('got no', key);
            }
          }
          return dbUser
        },

  getRepos: function (userData) {
    var result = JSON.parse(userData)
    var handle = result.items[0].login
    return apiCalls.getReposByGitName(handle)
  },
   getAllLanguageBytes: function(repoArray, languageHash, res, index) {
     var that= this;
    var url = repoArray[index].languages_url;
    apiCalls.getLanguagesBytes(url)
    .then(function (data) {
      languageHash = that.addLanguageBytes(languageHash,data)
      if (index<repoArray.length-1) {
        that.getAllLanguageBytes(repoArray,languageHash, res, index+1)
      } else{
        res.send(languageHash)
      }
    })
  },

  addLanguageBytes: function(languageHash, data) {
    var languageBytes = JSON.parse(data);
    //track characters for each language
    for (var language in languageBytes) {
      if (languageHash[language]) {
        languageHash[language] += languageBytes[language];
        // console.log(languageHash);
      } else {
        languageHash[language] = languageBytes[language]
      }
    }
    return languageHash
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
   //messy from here on down:
 //Checks to see if scraping is finished; if not, scrapes next element (recursively)
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
