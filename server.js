var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/src'));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/users', function(req, res){
  fs.readFile('users.json', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
    res.json(data);
  });
})

app.post('/users', function(req, res){
  var recieved = JSON.stringify(req.body);
  fs.writeFile("users.json", recieved, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("Data saved!");
  });
})

app.listen(3000, function () {
  console.log('Server listening on port 3000!');
});
