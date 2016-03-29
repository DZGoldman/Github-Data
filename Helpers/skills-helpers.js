module.exports = {
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
