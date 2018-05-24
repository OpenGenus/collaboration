var express = require("express"),
	bodyParser = require("express"),
	app = express();
	var request = require('request');
	var cheerio = require('cheerio');


const phantom = require('phantom');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// ====================
// BEGINNING OF ROUTES
// ====================

app.get("/", function(req, res){
	res.render("index");
});

app.post("/render-view", function(req, res){
	//var url_to_get = req.query.name;
	var second_try = req.body.url;
	// app.get(url_to_get, function(req, res){
	// 	console.log(res);
	// });
	console.log(second_try);
	request('http://www.google.com', function (error, response, body) {
	  console.log('error:', error); // Print the error if one occurred
	  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	  console.log('body:', body); // Print the HTML for the Google homepage.
	  var $ = cheerio.load(body);
	  $('body').append('<script>alert("test");</script>');
	  res.send($.html());
	  //res.render("content", {contentLoad: body});
	});
	//https://github.com/amir20/phantomjs-node/blob/master/examples/render.js
	// (async function() {
	// 	const instance = await phantom.create();
	// 	const page = await instance.createPage();
	// 	await page.on('onResourceRequested', function(requestData) {
	// 		console.info('Requesting', requestData.url);
	// 	});

	// 	const status = await page.open('https://www.google.co.in/');
	// 	const content = await page.property('content');
	// 	console.log(content);
	 	
	// 	//res.send(content);
	// 	page.switchToMainFrame().then(function() {
	//     	// now the context of `page` will the main frame
	// 	});
	// 	await instance.exit();
	// })();

});








// ======================
// STARTING UP THE SETUP
// ======================
app.listen(4400, function(){
	console.log("Server running at url http://localhost:4400/ ");
});