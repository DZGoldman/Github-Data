var requestOptions = require ('./app-helpers').requestOptions,
rp = require('request-promise');
module.exports = {
  getUserByGitName: function (username) {
    var url = 'https://api.github.com/users/' + username + '/repos';
    requestOptions.url = url;
    return rp(requestOptions)

  },
  getUserByEmail: function (email) {

  },
  getSkillsBasic: function (userdata) {

  },
  getSkillsComplex: function (userdata) {

  }
}
