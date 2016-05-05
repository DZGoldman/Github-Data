require('dotenv').config({
  silent: true
});

var express = require('express'),
  app = express(),
  morgan = require('morgan'),
  pg = require('pg'),
  Sequelize = require('sequelize'),
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    // process.env.PORT ||
    port: 5432
  }),
  User = sequelize.import(__dirname + "/User"),
  apiCalls = require('./Helpers/api-calls.js'),
  skillHelpers = require('./Helpers/skills-helpers.js'),
  CronJob = require('cron').CronJob,
  fs = require('fs'),
  bodyParser = require('body-parser'),
  session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('combined'));

//set public/ views
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/Public'));

//Sync all tables in database:
sequelize.sync().then(function() {
  console.log('tables synced');
}).catch(function() {
  console.log('table problems');
})

//auth/sessions
app.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: true,
  saveUninitialized: true
}));

app.use(unless('/login', auth));

function auth(req, res, next) {
  if (req.session && req.session.user === process.env.APP_LOGIN && req.session.admin)
    return next();
  else
    return res.render('login');
};

function unless(path, middleware) {
  return function(req, res, next) {
    if (path === req.path) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};

//routes

app.get('/', function(req, res) {
    res.render('index');
});



app.post('/login', function(req, res) {
  var username = req.body.email;
  var password = req.body.password;
  if (!username || !password) {
    res.send('login failed');
  } else if (username === process.env.APP_LOGIN && password === process.env.APP_PASSWORD) {
    req.session.user = process.env.APP_LOGIN;
    req.session.admin = true;
    res.render('index');
  } else {
    res.render('login');
  }
});

app.get('/logout', function(req, res) {
    req.session.destroy();
    res.render('login');
  })
  //route for testing thiings out
app.get('/playground', function(req, res) {
  // console.log(typeof process.env.TEST);
  console.log(req.session);
});

//Link server:
app.listen(process.env.PORT, function() {
  console.info('Listening on  port ' + process.env.PORT)
});

//Link up route files:
fs.readdirSync('./routes').forEach(function(file) {
  if (file.substr(-3) == '.js') {
    route = require('./routes/' + file);
    route.controller(app, User);
  }
});
