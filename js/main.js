// Option variables
const accessKeyUnsplash = "2xFV2a2s7uQhCWhtDVLQ73tFhx-4VNO5p16NFpCQsdM";
const backgroundTTL = 86400000;  // background TTL (expiry time) - 24 h = 86400000 ms


// DOM Elements
const time = document.getElementById('time');
const greeting = document.getElementById('greeting');
const name = document.getElementById('name');
// const focus = document.getElementById('photo-dir');
const bgInfo = document.getElementById('bgInfo');
const quotePhrase = document.querySelector('#quote .phrase');
const quoteAuthor = document.querySelector('#quote .author');


// Options
const showAmPm = false;


// Show Time
function showTime() {
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();

  // Set AM or PM
  const amPm = hour >= 12 ? 'PM' : 'AM';

  // 12hr Format
  hour12 = hour % 12 || 12;

  // Output Time
    if (showAmPm) {
        time.innerHTML = `${hour12}<span>:</span>${addZero(min)} ${amPm}`;
    } else {
        time.innerHTML = `${hour}<span>:</span>${addZero(min)}`
    }

  setTimeout(showTime, 1000);
}


// Add Zeros
function addZero(n) {
  return (parseInt(n, 10) < 10 ? '0' : '') + n;
}


// Set Greet
function setGreet() {
  let today = new Date(),
  hour = today.getHours();

  if (hour < 12) {
    // Morning
    greeting.textContent = 'Good Morning, ';
  } else if (hour < 20) {
    // Afternoon
    greeting.textContent = 'Good Afternoon, ';
  } else {
    // Evening
    greeting.textContent = 'Good Evening, ';
    // document.body.style.color = 'white';
  }
}


// Function to grab a random image from Unsplash
function setBackgroundFromUnsplash() {
  const http = new XMLHttpRequest();
  const url = "https://api.unsplash.com/photos/random" + "?client_id=" + accessKeyUnsplash + "&orientation=landscape&query=nature";
  http.open("GET", url);
  http.send()

  http.onreadystatechange=function() {
    if (this.readyState==4 && this.status==200) {
      const image = JSON.parse(http.responseText);
      const unsplashBackgroundURL = `url(${image['urls']['regular']})`.replace("w=1080", "w=1920"); // .replace("fit=max", "fit=clip")
      const unsplashBackgroundDescription = `${image['location']['city'] ? image['location']['city'] : ''} \
        ${image['location']['city'] ? ' ,' : ''} \ 
        ${image['location']['country'] ? image['location']['country'] : ''}`;
      const unsplashBackgroundSourceURL = image['links']['html'];

      // Apply background and info
      document.body.style.backgroundImage = unsplashBackgroundURL;
      bgInfo.textContent = unsplashBackgroundDescription;
      bgInfo.href = unsplashBackgroundSourceURL;
      // Save background link and info to local storage
      setWithExpiry("unsplashBackgroundURL", unsplashBackgroundURL, backgroundTTL)
      localStorage.setItem('unsplashBackgroundDescription', unsplashBackgroundDescription);
      localStorage.setItem('unsplashBackgroundSourceURL', unsplashBackgroundSourceURL);
    }
  } 
}


// Set Background
function setBackground(imgSource) {
  if (imgSource == "unsplash") {
    // Check if current image has expired
    if (getWithExpiry("unsplashBackgroundURL")) {
      // Apply saved image
      document.body.style.backgroundImage = getWithExpiry("unsplashBackgroundURL");
    } else {
      // Apply new image
      setBackgroundFromUnsplash();
    }
    
  } else {
    // Apply default images depending on hour of the day
    let today = new Date(),
    hour = today.getHours();

    if (hour < 12) {
      // Morning
      document.body.style.backgroundImage = "url('https://i.ibb.co/7vDLJFb/morning.jpg')";
    } else if (hour < 20) {
      // Afternoon
      document.body.style.backgroundImage = "url('https://i.ibb.co/3mThcXc/afternoon.jpg')";
    } else {
      // Evening
      document.body.style.backgroundImage = "url('https://i.ibb.co/924T2Wv/night.jpg')";
      // document.body.style.color = 'white';
    }
  }
}


// Get Name
function getName() {
  if (localStorage.getItem('name') === null) {
    name.textContent = '[Enter Name]';
  } else {
    name.textContent = localStorage.getItem('name');
  }
}


// Set Name
function setName(e) {
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem('name', e.target.innerText);
      name.blur();
    }
  } else {
    localStorage.setItem('name', e.target.innerText);
  }
}


// Get Focus
// function getFocus() {
//   if (localStorage.getItem('focus') === null) {
//     focus.textContent = '[Enter Focus]';
//   } else {
//     focus.textContent = localStorage.getItem('focus');
//   }
// }


// Set Focus
// function setFocus(e) {
//   if (e.type === 'keypress') {
//     // Make sure enter is pressed
//     if (e.which == 13 || e.keyCode == 13) {
//       localStorage.setItem('focus', e.target.innerText);
//       focus.blur();
//     }
//   } else {
//     localStorage.setItem('focus', e.target.innerText);
//   }
// }


name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
// focus.addEventListener('keypress', setFocus);
// focus.addEventListener('blur', setFocus);


// Function to grab a random quote
function getRandomQuote() {
  const http = new XMLHttpRequest();
  const url =  "https://type.fit/api/quotes";
  http.open("GET", url);
  http.send()

  http.onreadystatechange=function() {
    if (this.readyState==4 && this.status==200) {
      const quote = JSON.parse(http.responseText);
      let randomNum = Math.floor(Math.random()*quote.length);
      quotePhrase.textContent = quote[randomNum]["text"];
      quoteAuthor.textContent = "— " + quote[randomNum]["author"];
    }
  } 
}


function setWithExpiry(key, value, ttl) {
  const now = new Date()

  // item is an object which contains the original value as well as the time when it's supposed to expire
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  }
  localStorage.setItem(key, JSON.stringify(item))
}


function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key)

  // if the item doesn't exist, return null
  if (!itemStr) {
    return null
  }

  const item = JSON.parse(itemStr)
  const now = new Date()

  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage and return null
    localStorage.removeItem(key)
    return null
  }
  return item.value
}

// Load extension options and run
chrome.storage.sync.get(['imgSource', 'showQuotes'], function(result) {
  showTime();
  setGreet();
  setBackground(result.imgSource);
  getName();
  // getFocus();
  if (result.showQuotes) {
    getRandomQuote();
  }
});

