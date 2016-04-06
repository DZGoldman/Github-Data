$(function() {
  console.log('Hello, Dave.');

  // code here is (largely) from https://cmatskas.com/importing-csv-files-using-jquery-and-html5/x
  $('.buttons').click(upload)
  function browserSupportFileUpload() {
    var isCompatible = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      isCompatible = true;
    }
    return isCompatible;
  }
  // Method that reads and processes the selected file
  function upload(evt) {
    console.log('uploading');
    var action = this.id;
    if (!browserSupportFileUpload()) {
      alert('The File APIs are not fully supported in this browser!');
    } else {
      $('#results').empty();
      $('#results').text('saving data...')
      var data = null;
      var file =$('#txtFileUpload')[0];
      console.log('this', this);
      var file = file.files[0];
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(event) {
        var csvData = event.target.result;
        data = $.csv.toObjects(csvData);
        if (data && data.length > 0) {
          console.log('Imported -' + data.length + '- rows into the browser successfully!');
        } else {
          alert('No data to import!');
        };

 if (action=='upload-file') {
        $.ajax({
          dataType: 'JSON',
          data: {data:data},
          type: 'POST',
          url: '/upload'
        })
        .done(function (data) {
            $('#results').empty();
          if (data.length==0) {
            $('#readout').text('All users successfully added!')
          }else{
          $('#results').text( String(data.length)+' of the users failed to upload...')
            data.forEach(function (error) {
              var $li = $('<li>');
              $li.text(error);
              $('#results').append($li);
            })

          }
        });
      }else if (action=='export-csv') {

      }




      };
      reader.onerror = function() {
        alert('Unable to read ' + file.fileName);
      };

    }
  }





})
