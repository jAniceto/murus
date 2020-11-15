// Saves options to chrome.storage
function save_options() {
  var showAmPm = document.getElementById('showAmPm').checked;
  var imgSource = document.getElementById('imgSource').value;
  var subreddit = document.getElementById('subreddit').value;
  var showQuotes = document.getElementById('quotes').checked;
  chrome.storage.sync.set({
    showAmPm: showAmPm,
    imgSource: imgSource,
    subreddit: subreddit,
    showQuotes: showQuotes,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);
  });
}

// Restores options using the preferences stored in chrome.storage.
function restore_options() {
  // Use default value imgSource = 'default'
  chrome.storage.sync.get({
    showAmPm: false,
    imgSource: 'default',
    subreddit: 'earthporn',
    showQuotes: true
  }, function(items) {
    document.getElementById('showAmPm').checked = items.showAmPm;
    document.getElementById('imgSource').value = items.imgSource;
    document.getElementById('subreddit').value = items.subreddit;
    document.getElementById('quotes').checked = items.showQuotes;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);