
var rp = require('request-promise'),
  //parameters for making requests to Github api:
  requestOptions = {
      url: '', //URL to hit
      method: 'GET', //Specify the method
      headers: {
        'user-agent': process.env.USERNAME
      },
      auth: {
        user: process.env.USERNAME,
        password: process.env.PASSWORD
      }
    }
  //All requests to the Github api go here:
module.exports = {
  rateLimit: function (req, res) {
      requestOptions.url = 'https://api.github.com/rate_limit'
      rp(requestOptions).then( function(data) {
        res.send(data)
      }).catch(function (data) {
        res.send(data)
      })
  },
  goToUrl: function (url) {
    requestOptions.url = url;
    return rp(requestOptions)
  },
  getReposByGitName: function(username) {
    requestOptions.url = 'https://api.github.com/users/' + username + '/repos';
    return rp(requestOptions)
  },

  getUserByEmail: function(email) {
    requestOptions.url = 'https://api.github.com/search/users?q=' + email + '+in%3Aemail&type=Users';
    return rp(requestOptions)
  },

  getReposFromEmailSearch: function(data) {
    requestOptions.url = data.items.repos_url
    return rp(requestOptions)
  },

  getLanguagesBytes: function(languages_url) {
    requestOptions.url = languages_url
    return rp(requestOptions)
  },

  // TODO:_(still in progess)
  //fixed: type- user; params- location, language
  searchUsers: function (language, location) {
    requestOptions.url='https://api.github.com/search/users?q=language%3A'
    +language+'+location%3A'
    +location+'&type=Users';
    console.log(requestOptions.url);
    return rp(requestOptions)
    //check if hirable?
  }

} // end module
