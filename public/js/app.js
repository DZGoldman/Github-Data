console.log('i am in here');

var LanguagesObject = {};

function getSkills(email) {
LanguagesObject;
var repo;
var repos_url;
//get user info by email:
$.get('https://api.github.com/search/users?q='+ email +'+in%3Aemail&type=Users').done(function (data) {
  user = data;
  console.log(user);
  repos_url = user.items[0].repos_url;

  //get urls to all of users repos
  $.get(repos_url).done(function (data) {
    var allLanguages = []
    data.forEach(function (repo) {
      if (repo.languages_url) {
        allLanguages.push(repo.languages_url);
      }
    });

    //gather data for each language, reccursively
    var languageCount = allLanguages.length;


    function addLanguages(index) {
      $.get(allLanguages[index]).done(function (data) {

        languageList = data;
        if (typeof languageList=='object') {
        for(var language in languageList){
          // console.log(language);
          if (LanguagesObject[language]) {
            LanguagesObject[language]+= languageList[language];

          }else{
            LanguagesObject[language]=languageList[language]
          }
        }
      };
      if (index==languageCount-1) {
        console.log(LanguagesObject)
        // $.ajax(
        //      {
        //      dataType: 'json',
        //      data: {data:LanguagesObject},
        //      type: 'get',
        //      url: '/new'
        //    }
        //   );

      }
      })

      if (index<languageCount) {
        addLanguages(index+1)
      }
    }

     addLanguages(0);



  }) // end get repos
}) // end get user

}

var emailInput ='jc2johnny@gmail.com'
