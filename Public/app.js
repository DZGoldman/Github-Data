$(function() {
  console.log('Hello, Dave.');

  // code here is (largely) from https://cmatskas.com/importing-csv-files-using-jquery-and-html5/x
  $('.skills-buttons').click(upload)
  $('.jobs-buttons').click(upload)
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
      var data = null;
      if (this.className =='skills-buttons') {
          var file =$('#userFileUpload')[0];
      }else if (this.className=='jobs-buttons') {
        var file =$('#jobsFileUpload')[0];
      }

      var file = file.files[0];
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(event) {
        var csvData = event.target.result;
        data = $.csv.toObjects(csvData);
        if (data && data.length > 0) {
          console.log('Imported -' + data.length + '- rows into the browser successfully!');
          sendToServer(data,action)
        } else {
          alert('No data to import!');
        };
      };
      reader.onerror = function() {
        alert('Unable to read ' + file.fileName);
      };
    }
  }


function sendToServer(data, action) {
   if (action=='save-to-db') {
         $('#results').text('gathering skills and saving data...')
        $.ajax({
            dataType: 'JSON',
            data: {data:data},
            type: 'POST',
            url: '/upload'
          })
          .done(function (data) {
              $('#results').empty();
            if (data.length==0) {
              alert('All users successfully added with their skills!!')
            }else{
            alert(String(data.length)+' of the users failed to upload. See page for errors...)')
              data.forEach(function (error) {
                var $li = $('<li>');
                $li.text(error);
                $('#results').append($li);
              })
            }
          });
        }else if (action=='export-csv') {
             $('#results').text('gathering skills and generating new CSV...')
          $.ajax({
            dataType: 'JSON',
            data: {data:data},
            type: 'POST',
            url: '/export-csv'
          }).done(function (data) {
            alert('CSV with skills created and ready for downloading!')
            $('#download-link').show()
          })
        }else if (action=='compare'){
          $.ajax({
            dataType: 'JSON',
            data: {data:data},
            type: 'POST',
            url: '/compare'
          }).done(function (data) {
            console.log(data);
          })
        }
  }


$('#test').click(function () {
  $.ajax({
    type: 'get',
    url: '/playground'
  }).done(function () {
    console.log('done');
  })

})




})
