var express = require("express");
var Gamedig = require("gamedig");
var cors = require('cors');
var app = express();

app.use(cors());

app.use(express.static('dist'));

function timeUnitsBetween(startDate, endDate) {
  let delta = Math.abs(endDate - startDate) / 1000;
  const isNegative = startDate > endDate ? -1 : 1;
  return [
    ['days', 24 * 60 * 60],
    ['hours', 60 * 60],
    ['minutes', 60],
    ['seconds', 1]
  ].reduce((acc, [key, value]) => (acc[key] = Math.floor(delta / value) * isNegative, delta -= acc[key] * isNegative * value, acc), {});
}

const getWipedDate = (tagObject) => {
  const born = Object.values(Object.fromEntries(Object.entries(tagObject).filter(([key, value]) => value.includes('born'))));
  const timestamp = born[0].replace('born', '');
  const date = new Date(Number(timestamp) * 1000);
  const time = timeUnitsBetween(date, new Date());
  return time;
}

app.get('/api',
  async (req, res, next) => {

    try {
      const query = await Gamedig.query({
        type: 'rust',
        host: '94.76.230.8',
        requestRules: true
      });

      const data = {
        "name": query['name'],
        "map": query['map'],
        "players": query['raw']['numplayers'],
        "maxplayers": query['maxplayers'],
        "wiped": getWipedDate(query['raw']['tags'])
      }

      res.send(data);
      //res.send('hi');
    } catch (e) {
      res.send({error: true, message: "Failed to query servers."});
      console.log(e);
    }

  });

app.listen(2345, () => {
  console.log('express live');
});
