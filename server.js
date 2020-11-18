const express = require('express');
const cors = require('cors');

const character = require('./controllers/character');
const { SKYHAMMER_API_PORT } = require('./config/connection');

const app = express();
app.use(express.json());
app.use(express.static('static'));
app.use(cors());

app.get('/character/:id?', (req, res) => { character.getCharacter(req, res) });

app.listen(SKYHAMMER_API_PORT, () => {console.log(`Listening on port ${SKYHAMMER_API_PORT}.`)});
