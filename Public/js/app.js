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
        var data = [jobData, talentData];
        AJAX.getMatches(data)
        .done(AJAX.doneGetMatches)
      }
    };
  });
  //Old: hide shows buttons, still may eventually use
  // function showButtons(evt) {
  //   console.log('update');
  //   if($('#userFileUpload')[0].files.length>0){
  //     $('#save-to-db').show();
  //     $('#export-csv').show();
  //     if( $('#jobsFileUpload')[0].files.length>0) $('#compare').show();
  //
  //   }else{
  //     $('#export-csv').hide(); $('#save-to-db').hide(); $('#compare').hide();
  //   }
  // }
    // $('#save-to-db').hide();
    //   $('#export-csv').hide();
    //     $('#compare').hide();
    //
    // $('#userFileUpload').change(showButtons);
    // $('#jobsFileUpload').change(showButtons)

})
