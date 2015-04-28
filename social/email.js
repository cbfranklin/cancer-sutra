var express = require('express');
var app = express();
var mustache = require('mustache');
var fs = require('fs');
var nodemailer = require('nodemailer');
//var mandrillTransport = require('nodemailer-mandrill-transport');
var smtpTransport = require('nodemailer-smtp-transport');

var template,
	positionsData;

/*var transport = nodemailer.createTransport(mandrillTransport({
	auth: {
		apiKey: 'DxGGsCBodLBYErsgYxB25w'
	}
}));*/

var transport = nodemailer.createTransport(smtpTransport({
    host: 'smtp.mandrillapp.com',
    port: 587,
    auth: {
        user: 'connorbfranklin@gmail.com',
        pass: 'DxGGsCBodLBYErsgYxB25w'
    }
}));

fs.readFile('./email-template.html','utf8', function read(err, html) {
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

app.get('/email/:position/:email/:message', function (req, res) {

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

	output = '<p>'+decodeURI(req.params.message)+'</p><br><br>'+output;

	transport.sendMail({
	    to: req.params.email,
	    from: 'no-reply@cancersutra.com',
	    subject: 'Introducing The Cancer Sutra: At-home (In the Bed, On the Counter, Against a Wall) Cancer Detection',
	    html: output
	}, function(err, info) {
	    if (err) {
	        console.error(err);
	    } else {
	        console.log(info);
	        res.send('sent'+req.params.position+' to '+req.params.email)
	    }
	});


});

var server = app.listen(3001, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Cancer Sutra Email listening at: http://%s:%s', host, port);

});
