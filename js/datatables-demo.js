// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#example').DataTable();
});
$('#example').dataTable( {
  "columnDefs": [
    { "searchable": false, "targets": 0 }
  ]
} );
