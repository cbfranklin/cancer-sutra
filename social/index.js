var express = require('express');
var app = express();
var mustache = require('mustache');
var fs = require('fs');
var template,
	positionsData;

fs.readFile('./template.html','utf8', function read(err, html) {
	if (err) {
		throw err;
	}
	template = html;
});

fs.readFile('../data/positions.json', function read(err, data) {
	if (err) {
		throw err;
	}
	positionsData = JSON.parse(data);
});

app.get('/positions/:position', function (req, res) {
	var positionIndex;
	for(i in positionsData){
		if(positionsData[i]['element-name'] === req.params.position){
			positionIndex = i;
		}
	}
	var view = {
		position: positionsData[positionIndex]
	};
	var output = mustache.render(template, view);
	res.send(output)
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Cancer Sutra Social listening at: http://%s:%s', host, port);

});
