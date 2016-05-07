//Check that CSV have right column
var Validate = {
  talentCSV: function (talentArray) {
    if (!talentArray[0].giturl) {
      alert("Your CSV needs a giturl column");
      return false
    }
    return true
  },
  compareCSV: function (jobsArray, talentArray) {
    if (!talentArray[0].skills) {
      alert("Your talent CSV needs a skills column");
      return false
    }else if (!jobsArray[0].skills) {
      alert("Your Job CSV needs a skills column");
      return false
    }else{
      return true
    }

  }

}
