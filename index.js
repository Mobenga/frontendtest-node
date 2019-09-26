const path = require('path');
const express = require('express');
const fs = require('fs');
const parse = require('csv-parse');

const port = 3000;
const address = "0.0.0.0";
const app = express();

let rowCount = 0;
let rows = [];
let header = [];

fs.createReadStream('data/players.csv')
  .pipe(parse({delimiter: ";"}))
  .on('data', function (data) {
    if (!rowCount) {
      header = data;
    } else {
      let row = {};
      data.map((data, i) => {
        row[header[i]] = data;
      });
      rows.push(row);
    }
    rowCount++;
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/players', function(req, res) {
  res.json(rows.map(row => { return { name: row.name, id: row.playerId }}));
});

app.get('/api/player/:id', function(req, res) {
  let returner = rows.filter(row => {
    return row.playerId == req.params.id
  })
  if (returner.length) {
    res.json(returner);
  } else {
    res.status(404).send("player not found");
  }
});

app.listen(port, address, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('API up at http://'+address+':'+port);
});
