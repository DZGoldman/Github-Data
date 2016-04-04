var secrets = require('../secrets.js')
//parameters for making requests to Github api:

module.exports = {
requestOptions: {
  url: '', //URL to hit
  method: 'GET', //Specify the method
  headers: {
    'user-agent': secrets.username
  },
  auth: {
    user: secrets.username,
    password: secrets.password
  }
}

}
