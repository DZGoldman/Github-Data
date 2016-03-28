module.exports = {
  rateLimit: function (req, res) {
  User.count().then(function (c) {
      console.log(c);
    })
    requestOptions.url='https://api.github.com/rate_limit'
    request(requestOptions,function (err, resp, body) {
  //     var unixTime =body.resources.rate.reset;
  //
  //     time = new Date(unixTime * 1000),datevalues =
  //
  //    String(date.getHours() )+':'+
  //    String(date.getMinutes())+':'+
  //    String(date.getSeconds())
  // ;
  //     output = body;
  //     output.humantime = time;
      res.send(body)
    })

  }
}
