var express = require('express'),
  app = express(),
  morgan = require('morgan'),
  request = require('request'),
  pg = require('pg'),
  secrets = require('./secrets.js'),
  Sequelize = require('sequelize'),
  sequelize = new Sequelize('postgres://localhost/githubdata1', {
    dialect: 'postgres'
  }),
  User = sequelize.import(__dirname + "/User"),
  sheetHelpers = require('./Helpers/sheet-helpers.js'),
  skillHelpers = require('./Helpers/skills-helpers.js'),
  CronJob = require('cron').CronJob,
  fs = require ('fs'),
  appHelpers = require('./Helpers/app-helpers.js'),





requestOptions = appHelpers.requestOptions;
sequelize.sync()
  .then(function () {
    console.log('tables synced');
  })
  .catch(function () {
      console.log('failure to sync');
  })

app.use(  express.static(__dirname+'/public'));
pg.connect('postgres://localhost/githubdata-dev', (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('connection successfull');
  }
});

app.use(morgan('combined'));

//GET RATE LIMIT


// GET GOOGLE SHEET


// GET 5000 USER'S SKILLS




app.get('/', function(req, res) {
  res.send('landing page')
});


app.get('/nodecron', function (req, res) {
    new CronJob('0 0 0/1 1/1 * * *', function() {
      console.log('You will see this message every second');
    }, null, true, 'America/New_York');
})
// app.get('/intervalcron', function(req, res) {
//   skillHelpers.logTime()
//
// var time =1000*60*62
//   getSkillsByUrl()
//   console.log('^first');
//   setInterval(function () {
//     console.log('scrape');
//     skillHelpers.logTime()
//     getSkillsByUrl()
//
// }, time)
//
// });

app.listen(3000, function() {
  console.info('Listening on  port 3000...')
})

skillHelpers.logTime()

app.get('/test', function (req, res  ) {
  requestOptions.url = 'https://api.github.com/user/emails'
  request(requestOptions, function (err, resp, data) {
    console.log(err);
    console.log(resp);
    console.log(data);
    res.send(resp)
  })
})


fs.readdirSync('./routes').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./routes/' + file);
      route.controller(app, User);
  }
});
