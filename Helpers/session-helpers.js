
module.exports = {
  auth: function (req, res, next) {
    if (req.session && req.session.user === process.env.APP_LOGIN && req.session.admin)
      return next();
    else
    console.log('no');
      return res.render('login');
  },

  unless: function (path, middleware) {
    return function(req, res, next) {
      if (path === req.path) {
        return next();
      } else {
        return middleware(req, res, next);
      }
    };
  },

  login: function (req, res) {
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
  }

}
