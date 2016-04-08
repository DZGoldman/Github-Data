

  // Method that reads and processes the selected file, code (mostly) from here:
  //https://cmatskas.com/importing-csv-files-using-jquery-and-html5
  //helper function:
  function browserSupportFileUpload() {
    var isCompatible = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      isCompatible = true;
    }
    return isCompatible;
  };

  function upload(source) {

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

  function read(file, afterRead) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event) {
      var csvData = event.target.result;
      data = $.csv.toObjects(csvData);

      if (data && data.length > 0) {
        afterRead(data)
      } else {
        alert('No data to import!');
      };
    };
    reader.onerror = function() {
      alert('Unable to read ' + file.fileName);
    };
  };
