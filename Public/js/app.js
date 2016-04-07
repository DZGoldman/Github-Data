$(function() {
  console.log('I am in here.');


  $('#save-to-db').click(function(evt) {
    var file = upload('talent');
    read(file, afterRead);
    function afterRead(data) {
      AJAX.saveToDb(data)
      .done(AJAX.doneSaveToDb);
    };
  });


  $('#export-csv').click(function(evt) {
    var file = upload('talent');
    read(file, afterRead);
    function afterRead() {
      AJAX.exportCSV(data, 'save')
      .done(AJAX.doneExportCSV)
    }
  });

  $('#compare').click(function(evt) {
    var file = upload('jobs');
    read(file, afterRead);
    function afterRead(jobData) {
      var file = upload('talent');
      read(file, afterRead)
      function afterRead(talentData) {
        console.log([jobData, talentData]);
      }
    };
  });


})
