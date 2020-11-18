const path = require('path');
const fs = require('fs');
const { DownloaderHelper } = require('node-downloader-helper');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const sourceUrl = "http://andreasberghammer.pythonanywhere.com/";
const staticPath = path.join(__dirname, '../static/characters');
var isSourceLoaded = false;

function saveImage(url) {
  const fileNames = {};
  const regex = /\d{4}/gm;
  while ((m = regex.exec(url)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    m.forEach((match, groupIndex) => {
      fileNames[url] = match;
    });
  }
  const destination = staticPath;
  console.log(url, destination)
  const dl = new DownloaderHelper(url, destination, { fileName: fileNames[url] + '.png' });
  dl.on('start', () => console.log("START: " + fileNames[url]));
  dl.on('end', () => console.log("DOWNLOAD: " + fileNames[url]));
  dl.start();
}

function loadSource() {
  console.log();

  JSDOM.fromURL(sourceUrl, { resources: 'usable' })
    // RETRIEVE URLS
    .then(dom => {
      var imageUrls = [];
      imageQuery = dom.window.document.querySelectorAll('img');
      for (let i = 0; i < imageQuery.length; i++) {
        var url = new URL(imageQuery[i].getAttribute('src'), sourceUrl);
        if (url.href.includes('/images/')) {
          imageUrls.push(url.href);
        }
      }
      console.log("RETURN URLS: ")
      return imageUrls;
    })
    .then(urls => {
      // SAVE IMAGES
      urls.map((url) => { saveImage(url) });
    })
    .catch(err => console.log("Error at initializeSource: " + err));

  console.log("SOURCE LOADED");
  isSourceLoaded = true;
}

function getCharacter(req, res) {
  const { id } = req.body;
  
  if (fs.existsSync(staticPath)) {
    console.log("EXISTS");
    fs.readdir(staticPath, (err, files) => {
      if (err) { console.log(err) }
      else {
        let fileToSend = path.join(staticPath, files[Math.floor(Math.random() * files.length)]);
        console.log("RANDOM" + fileToSend);
        res.sendFile(fileToSend);
       }
    });
  } else {
    console.log("LOAD SOURCE");
    const imageUrls = loadSource();
  }

  if (id) {}
  else {
    console.log()
  }
}

module.exports = { getCharacter };
