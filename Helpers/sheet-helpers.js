//Helpers for importing google sheet data:
var url1 = 'https://spreadsheets.google.com/feeds/list/1-607M0KUFw3YlechaSVOUxCqX3Z44l5OPHQYqMr2mpw/od6/public/basic?alt=json',
url2 = 'https://spreadsheets.google.com/feeds/list/1uwbaWOQl54RphdZVpHogQNxvnYuXq2_zjBOnr1lJDu4/od6/public/basic?alt=json',
url3 = 'https://spreadsheets.google.com/feeds/list/1tuSK3jDjmzhI0YHs2NAb-zAQTb2JJWc4kT3gcBXHA6o/od6/public/basic?alt=json',
url4 = 'https://spreadsheets.google.com/feeds/list/1DudUIDsoG_0_2zi-lTceBJC9NilTyea5pWwKFA7v8cA/od6/public/basic?alt=json',
url5 = 'https://spreadsheets.google.com/feeds/list/1Q5KZDWJkidgCy80jPhTbX2TSy83LE6MoY8s9W73VofE/od6/public/basic?alt=json',
url6 = 'https://spreadsheets.google.com/feeds/list/1dX6jz7TlvpD_JbHkgYQ_78AiZpowj5GVNiIKgO04zno/od6/public/basic?alt=json',
url7 = 'https://spreadsheets.google.com/feeds/list/1Pc75q7CNilhUt-gwfyssuKB6sG-Hkhh_zHgYX54rGtA/od6/public/basic?alt=json';


module.exports = {
  urls:[url1,url2,url3,url4,url5,url6,url7],
  buildUser: function (infoArray,user) {
    infoArray.forEach(function (dataPoint, index) {
      switch (dataPoint.slice(0,3)) {
        case 'ema':
          user.email = infoArray[index].slice(7, infoArray[index].length).trim()
          break;
        case 'use':
          user.username = infoArray[index].slice(9, infoArray[index].length).trim()
          break;
        case 'git':
          user.giturl = infoArray[index].slice(8, infoArray[index].length).trim()
          break;
        case 'loc':
          user.location = infoArray[index].slice(10, infoArray[index].length).trim()
          break;
        case 'lat':
          user.latitude = infoArray[index].slice(10, infoArray[index].length)
          break;
        case 'lon':
          user.longitude = infoArray[index].slice(11, infoArray[index].length)
          break;
        case 'dist':
          user.distance_from_lt = infoArray[index].slice(16, infoArray[index].length)
          break;
        case 'sen':
          user.sent_boolean = infoArray[index].slice(13, infoArray[index].length)
          break;
        default:
      }
    }) // end info loop
  }
}
