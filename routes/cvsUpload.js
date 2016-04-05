function censor(censor) {
  var i = 0;
  return function(key, value) {
    if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value)
      return '[Circular]';
    if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';
    ++i; // so we know we aren't using the original object anymore
    return value;
  }
}



  module.exports.controller =  function (app, User) {

    app.post('/upload', function (req, res) {
      console.log('upload route');
      console.log('testing testing',req.body.data);
      res.send(req.body.data)

    })
  }
