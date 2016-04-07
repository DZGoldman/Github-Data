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
    $('#download-link').show()
  }
} // end AJAX module


function sendToServer(data, action) {
  if (action == 'save-to-db') {
    $('#results').text('gathering skills and saving data...')
    AJAX.saveToDb(data)
      .done(AJAX.doneSaveToDb);

  } else if (action == 'export-csv') {
    AJAX.exportCSV(data, 'save')
      .done(AJAX.doneExportCSV)

  } else if (action == 'compare') {
    
    $.ajax({
      dataType: 'JSON',
      data: {data1: data,
            data2: 'skills'},
      type: 'POST',
      url: '/compare'
    }).done(function(data) {
      console.log(data);
    })
  }
}
