 function distanceFromLt(lat2,lon2) {
    lat1= 40.742614;
    lon1= -73.991085;

    function toRadians(deg) {
      return deg*(Math.PI/180)
    }

    var R = 6371000; // metres
    var φ1 =toRadians(lat1);
    var φ2 =toRadians(lat2);
    var Δφ = toRadians(lat2-lat1);
    var Δλ = toRadians(lon2-lon1);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return Math.round(d/1000)
  }
distanceFromLt(39.4699075, -0.3762881)
