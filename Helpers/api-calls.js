var requestOptions = require('./app-helpers').requestOptions,
  rp = require('request-promise');
module.exports = {
  rateLimit: function (req, res) {
      requestOptions.url = 'https://api.github.com/rate_limit'
      request(requestOptions, function(err, resp, body) {
        res.send(body)
      })
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
    console.log(requestOptions.url);
    return rp(requestOptions)
  },

  getLanguagesBytes: function(languages_url) {
    requestOptions.url = languages_url
    return rp(requestOptions)
  }

}
