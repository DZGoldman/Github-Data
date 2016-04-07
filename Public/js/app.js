$(function() {
  console.log('Hello, Dave.');


  $('#save-to-db').click(function(evt) {

    var action = this.id
    var file = upload('talent', afterRead);
    read(file, 'save-to-db', afterRead);
    console.log(AJAX);
    function afterRead(csvData) {
      data = $.csv.toObjects(csvData);

      if (data && data.length > 0) {
        sendToServer(data, action)

      } else {
        alert('No data to import!');
      };

    };
  });

  $('#export-csv').click(function (evt) {
    var action = this.id
    var file = upload('talent');
    read(file, 'export-csv')
  })

  $('#compare').click(function(evt) {
    var action = this.id
    upload(action, 'talent')
  });


  // Method that reads and processes the selected file, code (mostly) from here:
  //https://cmatskas.com/importing-csv-files-using-jquery-and-html5/x
  //helper function:
  function browserSupportFileUpload() {
    var isCompatible = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      isCompatible = true;
    }
    return isCompatible;
  };

  function upload(source) {

    console.log('uploading');
    if (!browserSupportFileUpload()) {
      alert('The File APIs are not fully supported in this browser!');
    } else {
      $('#results').empty();
      var data = null;
      if (source == 'talent') {
        var file = $('#userFileUpload')[0];
      } else if (source == 'jobs') {
        var file = $('#jobsFileUpload')[0];
      } else {
        return 'something is wrong here...'
      }
      var file = file.files[0];
      return file
    }
  };

  function read(file, action, afterRead) {

    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event) {
      afterRead(event.target.result);
    };
    reader.onerror = function() {
      alert('Unable to read ' + file.fileName);
    };

  }

})
