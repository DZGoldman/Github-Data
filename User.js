module.exports =function (sequelize, Datatypes) {

return sequelize.define('user', {
  username: Datatypes.STRING,
  email: {
          type:Datatypes.STRING,
          validate:{
          isEmail: true
          }
        },
  giturl: {
          type:Datatypes.STRING,
          validate:{
          isUrl: true
          }
        },
  location: Datatypes.STRING,
  latitude: Datatypes.FLOAT,
  longitude:Datatypes.FLOAT,
  distance_from_lt: Datatypes.INTEGER,
  sent_boolean: {
                type:Datatypes.BOOLEAN,
                defaultValue: false},
  skills: Datatypes.ARRAY(Datatypes.TEXT),
  skills_found:{
                type:Datatypes.BOOLEAN,
                defaultValue: false}

});

}
