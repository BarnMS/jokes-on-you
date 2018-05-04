var games = {}
var keys = [];

var randomstring = require("randomstring");
const express = require('express')
const app = express()

app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})
app.get("/devtools-detect.js", (request, response) => {
  response.sendFile(__dirname + '/node_modules/devtools-detect/index.js')
})

app.get("/creategame", (req, res) => {
  var codekey = createGame();
  var code = codekey.split(", ")[0];
  var key = codekey.split(", ")[1];
  console.log(codekey);
  keys[keys.length] = key;
  games[code] = {};
  games[code].code = code;
  games[code].key = key;
  games[code].users = [];
  res.send(games[code]);
});

app.get("/getusers", (req, res) => {
  if(games[req.query.code] != undefined) {
    if(games[req.query.code].key == req.query.key) {
      res.send(games[req.query.code].users.join("\n"));
    }
  }
});

app.get("/joingame", (req, res) => {
  if(games[req.query.code.toUpperCase()] == undefined) {
    console.log("error");
    res.send("error");
  } else {
    if(games[req.query.code.toUpperCase()].users == undefined)
      games[req.query.code.toUpperCase()].users = [];
    
    if(games[req.query.code.toUpperCase()].users.indexOf(req.query.name) != -1)
      return res.send("taken");
    
    if(games[req.query.code.toUpperCase()].users.length == 8) {
      if(games[req.query.code.toUpperCase()].audience == undefined)
        games[req.query.code.toUpperCase()].audience = [];
      games[req.query.code.toUpperCase()].audience.unshift(req.query.name);
      res.send("audience");
    } else {

      games[req.query.code.toUpperCase()].users.unshift(req.query.name);
      //console.log(games[req.query.code.toUpperCase()]);
      res.send("game");
    }
  }
});

app.get("/deletegame", (req, res) => {
  if(games[req.query.code] != undefined) {
    if(games[req.query.code].key == req.query.key) {
      deleteGame(req.query.code, req.query.key);
      res.send("success")
    } else
      res.send("error")
  } else
    res.send("error")
});


const listener = app.listen(process.env.PORT, () => {
  console.log(`Port: ${listener.address().port}`)
})

function createGame() {
  var code = randomstring.generate({length: 4, capitalization : "uppercase"});
  var key = randomstring.generate(16);
  if(games[code] != undefined)
    createGame();
  else {
    if(keys.indexOf(key) != -1)
      createGame();
    else
      return code + ", " + key;
  }  
}

function deleteGame(code, key) {
  games[code] = undefined;
  keys.splice(keys.indexOf(key), 1)
}

const http = require('http');

setInterval(() => {
  http.get(`http://jokes-on-you-game.herokuapp.com/`);
  console.log("...");
}, 280000);
