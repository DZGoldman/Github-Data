var json2csv = require('json2csv');
var fs = require('fs');

module.exports = {

saveAsCSV:function(usersArray) {
  json2csv({data: usersArray}, function(err, csv) {
    if (err) console.log(err);
      fs.writeFile('users.csv', csv, function(err) {
        if (err) throw err;
        console.log('file saved');
      })
    });
  }

}
