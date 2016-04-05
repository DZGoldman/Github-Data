$(function () {
  console.log('Hello, Dave.');

  document.getElementById('txtFileUpload').addEventListener('change', upload, false);
  function browserSupportFileUpload() {
          var isCompatible = false;
          if (window.File && window.FileReader && window.FileList && window.Blob) {
          isCompatible = true;
          }
          return isCompatible;
      }
      // Method that reads and processes the selected file
      function upload(evt) {
      if (!browserSupportFileUpload()) {
          alert('The File APIs are not fully supported in this browser!');
          } else {
              var data = null;
              var file = evt.target.files[0];
              var reader = new FileReader();
              reader.readAsText(file);
              reader.onload = function(event) {
                  var csvData = event.target.result;
                  // console.log(csvData);
                  data = $.csv.toArrays(csvData);
                  // console.log(data);
                  console.log($.csv.toObjects(csvData)   );
                  if (data && data.length > 0) {
                    alert('Imported -' + data.length + '- rows successfully!');
                  } else {
                      alert('No data to import!');
                  }
              };
              reader.onerror = function() {
                  alert('Unable to read ' + file.fileName);
              };
          }
      }





})
