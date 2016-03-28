var Sequelize = require ('sequelize');
var sequelize = new Sequelize('postgres://localhost/githubdata-dev', {
  dialect: 'postgres'
});
module.exports.User = sequelize.define('user', {
  username: Sequelize.STRING,
  email: {
          type:Sequelize.STRING,
          validate:{
          isEmail: true
          }
        },
  giturl: {
          type:Sequelize.STRING,
          validate:{
          isUrl: true
          }
        },
  location: Sequelize.STRING,
  latitude: Sequelize.FLOAT,
  longitude:Sequelize.FLOAT,
  distance_from_lt: Sequelize.INTEGER,
  sent_boolean: {
                type:Sequelize.BOOLEAN,
                defaultValue: false},
  skills: Sequelize.ARRAY(Sequelize.TEXT)

});
