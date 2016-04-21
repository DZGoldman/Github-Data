$(function() {
  console.log('I am in here.');

  //click events for buttons defined here:

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
      var file = upload('match');
      read(file, afterRead);
      function afterRead(talentData) {
        var data = [jobData, talentData];
        console.log(jobData);
        AJAX.getMatches(data)
        .done(AJAX.doneGetMatches)
      }
    };
  });

  $('#search').click(function () {
    var language = $('#search-language').val().trim();
    var location = $('#search-location').val().trim();
    var limit = $('#search-limit').val().trim();

    location = '"'+location.replace(/ /g,"+")+'"';
    language = '"'+language.replace(/ /g,"+")+'"';

    if (!language || !location) {
      alert("Fill out both 'Language' and 'Location' boxes");
      return false
    };
    if (!limit) limit=100;
    AJAX.searchGithub(language, location, limit)
    .done(AJAX.doneSearchGithub)
  })
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
