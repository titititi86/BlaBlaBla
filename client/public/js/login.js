$('#login').ajaxForm({beforeSubmit: function(arr, $form, option) {
  arr.push({name: '__time', value: (new Date()).toGMTString()});
}});