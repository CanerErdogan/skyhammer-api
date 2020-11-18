const path = require('path');
const fs = require('fs');
const util = require('util');

const { SKYHAMMER_API_PORT } = require('../config/connection');

const staticPath = path.join(__dirname, '../static/characters');
const character = {
  id: undefined,
  name: null,
  race: null,
  gender: null,
  imgLink: ''
}

const readDir = util.promisify(fs.readdir);
async function readDirectory(dst) {
  const files = await readDir(dst)
  return files;
  // for (let file of files) { console.log(file) }
  // return path.join(dst, files[Math.floor(Math.random() * files.length)]);;
}

async function randomCharacter() {
  const random = character;
  const dst = staticPath;
  const re = /\d{4}/gm;
  return readDirectory(dst)
    .then(files => {
      const randomFile = files[Math.floor(Math.random() * files.length)];
      const imgPath = path.join(dst, randomFile);
      const imgLink = `http://localhost:${SKYHAMMER_API_PORT}/characters/${randomFile}`
      const id = Number(re.exec(randomFile)[0]);
      random.imgLink = imgLink;
      random.id = id;
      console.log('random', random)
      return random;
    })
}

async function getCharacter(req, res) {
  try {
    const { id } = req.body;
    randomCharacter().then(char => res.json(char));
  } catch (error) { console.log(error) }
}

module.exports = { getCharacter };
