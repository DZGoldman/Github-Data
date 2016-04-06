var json2csv = require('json2csv');
var fs = require('fs');

module.exports = {

saveAsCSV:function(usersArray, res) {
  json2csv({data: usersArray}, function(err, csv) {
    if (err) console.log(err);
      fs.writeFile('./Public/docs/users3.csv', csv, function(err) {
        if (err) throw err;
        console.log('file saved');

        // res.download('users1.csv', function (err) {
        //   if (err) {
        //     console.log(err);
        //   }
        // })

      })
    });
  }

}
