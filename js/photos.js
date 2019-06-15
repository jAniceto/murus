
// DOM elements
const album = document.getElementById('album');

// Get Album
function getAlbum() {
    if (localStorage.getItem('album') === null) {
        album.textContent = '[Enter Album ID]';
    } else {
        album.textContent = localStorage.getItem('album');
        return localStorage.getItem('album')
    }
}

// Set Album
function setAlbum(e) {
    if (e.type === 'keypress') {
      // Make sure enter is pressed
      if (e.which == 13 || e.keyCode == 13) {
        localStorage.setItem('album', e.target.innerText);
        album.blur();
      }
    } else {
      localStorage.setItem('album', e.target.innerText);
    }
}

album.addEventListener('keypress', setAlbum);
album.addEventListener('blur', setAlbum);

albumID = getAlbum();



// Grab photos from Google Photos
function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/photoslibrary https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata"})
        .then(function() { console.log("Sign-in successful"); },
            function(err) { console.error("Error signing in", err); });
}
    
function loadClient() {
    gapi.client.setApiKey("AIzaSyBginFTjjEIjb51YllaHWoivO7DMXAeOoE");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
                function(err) { console.error("Error loading GAPI client for API", err); });
}
    
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
    return gapi.client.photoslibrary.mediaItems.search({
        "resource": {
            "albumId": albumID
        }
    })
        .then(function(response) {
            // Handle the results here (response.result has the parsed body).
            console.log("Response", response);
        },
        function(err) { console.error("Execute error", err); });
}

gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "862825391225-u4a78auodj47r1b4kdh4hb35u27ncqrs.apps.googleusercontent.com"});
});

