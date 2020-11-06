// Saves options to chrome.storage
function save_options() {
  var imgSource = document.getElementById('imgSource').value;
  chrome.storage.sync.set({
    imgSource: imgSource,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores options using the preferences stored in chrome.storage.
function restore_options() {
  // Use default value imgSource = 'default'
  chrome.storage.sync.get({
    imgSource: 'default',
  }, function(items) {
    document.getElementById('imgSource').value = items.imgSource;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);