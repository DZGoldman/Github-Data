// all AJAX requests and their 'done' promises live here:
var AJAX = {
    that: this,
    saveToDb: function(data) {
      if(!Validate.talentCSV(data)) return false
      $('#spinner').show();
      $('#results').text('Gathering skills and saving users into database...')
      return $.ajax({
        dataType: 'JSON',
        data: {
          data: data
        },
        type: 'POST',
        url: '/upload'
      })
    },

    doneSaveToDb: function(data) {
      AJAX.clear();
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
      if(!Validate.talentCSV(data)) return false
      $('#spinner').show();
      $('#results').text('Gathering skills and generating new CSV...');
      return $.ajax({
        dataType: 'JSON',
        data: {
          data: data
        },
        type: 'POST',
        url: '/export-csv/' + option
      })
    },

    doneExportCSV: function(data) {
      AJAX.clear();
      alert('CSV with skills created and ready for downloading!')
      $('#download-talent-link').show()
    },

    getMatches: function(data) {
      var jobsArray = data[0], talentArray = data[1];
      if(!Validate.compareCSV(jobsArray, talentArray)) return false

      $('#spinner').show();
      console.log('getting matches:');
      return $.ajax({
        dataType: 'JSON',
        data: {
          jobsArray: jobsArray,
          talentArray: talentArray
        },
        type: 'POST',
        url: '/getMatches'
      })
    },

    doneGetMatches: function(data) {
      AJAX.clear();
      alert('Job Matches Found and Ready to download!')
      $('#download-matches-link').show()
    },

    searchGithub: function(language, location, limit) {
      $('#spinner').show();
      $('#results').text('Searching Github for users...')
      return $.ajax({
        dataType: 'JSON',
        data: {
          language: language,
          location: location,
          limit,
          limit
        },
        type: 'POST',
        url: '/searchusers'
      })
    },

    doneSearchGithub: function(data) {
        AJAX.clear();
      if (data[0]==false) {
        return alert('No such users were found...')}

      alert('Search results CSV ready to download!');
      $('#download-search-results-link').show();
    },

    clear: function() {
      $('.downloaded-file').hide();
      $('#results').empty();
      $('#spinner').hide();
    }
  } // end AJAX module
