app.use(express.static(__dirname + '/public'));

app.get('/test', function(req, res) {
  var requestOptions = {
    method: 'GET', //Specify the method
    headers: {
      'user-agent': secrets.username
    },
    auth: {
      user: secrets.username,
      password: secrets.password
    }
  }
  request.get('https://api.github.com/users/Alejandro-P-2011-2243/repos', requestOptions)
    // request('/ratelimit', function (err, res, data) {
    //   console.log(err, res,data);
    // })

})



function testing(cb) {
  requestOptions.url = 'https://api.github.com/users/dzgoldman'
  request(requestOptions, function(error, response, data) {
    cb(data)
  })
}

function getSkills(email) {
  var LanguagesObject = {};


  // var repo;
  var repos_url;
  //get user info by email:
  requestOptions.url = 'https://api.github.com/search/users?q=' + email + '+in%3Aemail&type=Users';

  request(requestOptions, function(err, response, data) {
      if (err) {
        console.log(err);
      }
      var user = JSON.parse(data);

      repos_url = user.items[0].repos_url;

      //get urls to all of users repos:
      requestOptions.url = repos_url

      request(requestOptions, function(err, response, data) {
          if (err) {
            console.log(err);
          }
          var allLanguages = []
            //for each repo, push url to the repo's language object:
          var urls = JSON.parse(data);
          urls.forEach(function(repo) {
            // console.log(repo.languages_url);
            if (repo.languages_url) {
              allLanguages.push(repo.languages_url);
            }
          });

          //gather data for each language, reccursively
          var languageCount = allLanguages.length;

          function addLanguages(index) {
            requestOptions.url = allLanguages[index];
            request(requestOptions, function(err, response, data) {
              if (err) {
                console.log(err);
              }
              //make sure it is indeed a languageList object
              if (typeof languageList == 'object') {
                languageList = JSON.parse(data);
                //track characters for each language
                for (var language in languageList) {
                  if (LanguagesObject[language]) {
                    LanguagesObject[language] += languageList[language];
                    // console.log(LanguagesObject);
                  } else {
                    LanguagesObject[language] = languageList[language]
                  }
                }
              };
              if (index == languageCount - 1) {
                console.log('output:');
                res.send(LanguagesObject)
                  // res.send(LanguagesObject)
                console.log('done');
              }
            })
            if (index < languageCount) {
              addLanguages(index + 1)
            }
          }

          addLanguages(0);

        }) // end get repos
    }) // end get user


}

var getShmails = function(req, res) {

  var email = req.params.email

  var LanguagesObject = {};

  // var repo;
  var repos_url;
  //get user info by email:
  requestOptions.url = 'https://api.github.com/search/users?q=' + email + '+in%3Aemail&type=Users';

  request(requestOptions, function(err, response, data) {
      if (err) {
        throw err;
      };

      //handle error of nothing found?
      // if (!data.items) {
      //
      //   res.send(false)
      //   return false
      // }
      var user = JSON.parse(data);

      repos_url = user.items[0].repos_url;

      //get urls to all of users repos:
      requestOptions.url = repos_url

      request(requestOptions, function(err, response, data) {
          if (err) {
            throw err;
          }
          var allLanguages = []
            //for each repo, push url to the repo's language object:
          var urls = JSON.parse(data);
          urls.forEach(function(repo) {
            // console.log(repo.languages_url);
            if (repo.languages_url) {
              allLanguages.push(repo.languages_url);
            }
          });

          //gather data for each language, reccursively
          var languageCount = allLanguages.length;

          function addLanguages(index) {
            requestOptions.url = allLanguages[index];
            request(requestOptions, function(err, response, data) {
              if (err) {
                throw err
              };

              var languageList = data

              // check to make sure it is a JSON string, not undefined
              if (typeof languageList == 'string') {
                languageList = JSON.parse(languageList);

                //track characters for each language
                for (var language in languageList) {

                  if (LanguagesObject[language]) {

                    LanguagesObject[language] += languageList[language];
                    // console.log(LanguagesObject);
                  } else {
                    LanguagesObject[language] = languageList[language]
                  }
                }
              };
              if (index < languageCount - 1) {
                addLanguages(index + 1)
              };
              if (index == languageCount - 1) {
                res.send(LanguagesObject)
              }
            })

          } // end addLanguages

          addLanguages(0);



        }) // end get repos
    }) // end get user
};
app.get('/getSkillsByEmail/:email', getShmails)


app.get('/public', function(req, res) {
  res.sendFile(__dirname + '/public/index.html')
})
