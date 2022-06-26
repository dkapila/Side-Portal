document.getElementsByTagName("html")[0].style.display="none";

function injectStyles(url) {
  var elem = document.createElement('link');
  elem.rel = 'stylesheet';
  elem.setAttribute('href', url);
  document.body.appendChild(elem);
}

window.onload=function() {
  injectStyles(chrome.extension.getURL('app.css'));

  var s = document.createElement('script');
  s.src = chrome.extension.getURL('app.js');

  s.onload = function() {
      this.parentNode.removeChild(this);
  };

  (document.head||document.documentElement).appendChild(s);
}

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage (message, sender, sendResponse) {
  location.href="javascript:window.side_portal.toggle_show();";  
}

