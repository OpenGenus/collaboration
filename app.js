var express = require("express"),
	bodyParser = require("express"),
	app = express();

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
	//https://github.com/amir20/phantomjs-node/blob/master/examples/render.js
	(async function() {
		const instance = await phantom.create();
		const page = await instance.createPage();
		await page.on('onResourceRequested', function(requestData) {
			console.info('Requesting', requestData.url);
		});

		const status = await page.open('https://www.geeksforgeeks.org/');
		const content = await page.property('content');
		console.log(content);
		res.send(content);
		page.switchToMainFrame().then(function() {
	    	// now the context of `page` will the main frame
		});
		await instance.exit();
	})();
});








// ======================
// STARTING UP THE SETUP
// ======================
app.listen(4400, function(){
	console.log("Server running at http://localhost:4400/");
});