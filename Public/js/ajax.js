
// all AJAX requests and their 'done' promises live here:
var AJAX = {
  saveToDb: function(data) {
    return $.ajax({
      dataType: 'JSON',
      data: {data: data},
      type: 'POST',
      url: '/upload'
    })
  },

  doneSaveToDb: function(data) {
    $('#results').empty();
    if (data.length == 0) {
      alert('All users successfully added with their skills!!')
    } else {
      alert(String(data.length) + ' of the users failed to upload. See page for errors...)')
      data.forEach(function(error) {
        var $li = $('<li>');
        $li.text(error);
        $('#results').append($li);
      })
    }
  },

  exportCSV: function(data, option) {
    $('#results').text('gathering skills and generating new CSV...')
    return $.ajax({
      dataType: 'JSON',
      data: {data: data},
      type: 'POST',
      url: '/export-csv/'+option
    })
  },

  doneExportCSV: function(data) {
    alert('CSV with skills created and ready for downloading!')
    $('#results').empty();
    $('#download-talent-link').show()
  },

  getMatches: function (data) {
      return $.ajax({
        dataType: 'JSON',
        data: {jobsArray: data[0],
              talentArray: data[1]
          },
        type: 'POST',
        url: '/getMatches'
      })
  },
  doneGetMatches: function (data) {
    console.log('done getting matches');
    alert('Job Matches Found and Ready to download!')
    $('#download-matches-link').show()
  }
} // end AJAX module
