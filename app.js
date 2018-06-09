var express = require("express"),
	bodyParser = require("express"),
	app = express();
	var request = require('request');
	var cheerio = require('cheerio');
	var url = require('url');
	var unblocker = require('unblocker');
	var querystring = require('querystring');
	var Transform = require('stream').Transform;

var google_analytics_id = process.env.GA_ID || null;
const phantom = require('phantom');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// ====================
// BEGINNING OF ROUTES
// ====================

function addGa(html) {
    if (google_analytics_id) {
        var ga = [
            "<script type=\"text/javascript\">",
            "var _gaq = []; // overwrite the existing one, if any",
            "_gaq.push(['_setAccount', '" + google_analytics_id + "']);",
            "_gaq.push(['_trackPageview']);",
            "var element_add = document.createElement('p')",
            "alert('Hi')",
            "(function() {",
            "console.log('Im in the function !!');",
            "  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;",
            "  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';",
            "  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);",
            "})();",
            "document.getElementsByTagName('body').insertAdjacentHTML('afterbegin','<div><h1>I</h1><h2>was</h2><h3>inserted</h3></div>');",
            "</script>"
            ].join("\n");

        html = html.replace("</body>", ga + "\n\n</body>");
    }
   //var iframe_element = "<script>console.log('Im in');var iframe_ele = document.createElement('iframe');iframe_ele.setAttribute('src', './views/partials/header.html');iframe_ele.setAttribute('width', '1000');iframe_ele.setAttribute('height', '1000');document.body.appendChild(iframe_ele);</script>" 
    var form_element = [
    "<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'></script>",
    "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>",
    "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css' integrity='sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp' crossorigin='anonymous'>",
    // "<script>window.onload = function() { ",
    "<script>$(document).ready(function(){",
    "var div_element = document.createElement('div');",
    "div_element.setAttribute('id', 'front');",
    "document.body.appendChild(div_element);",
    "$(function(){ ",
    "console.log('Im in');",
    "$('#front').html('<nav class='navbar navbar-default'><div class='container-fluid'><div class='navbar-header'><button type='button' class='navbar-toggle collapsed' data-toggle='collapse' data-target='#bs-example-navbar-collapse-1' aria-expanded='false'>');",
    " });",
    "});",
    "</script>"].join("\n");
    //var form = "<form action='no-js' method='get'><input type='text' id='url' name='url' autofocus='autofocus'/><input type='submit' value='Go' /></form>";
    //var itemsToAdd = "<script>console.log('I went In');var node = document.createElement('div');node.innerHTML = '<form action="no-js" method="get"><input type="text" id="url" name="url" autofocus="autofocus"/><input type="submit" value="Go" /></form>';document.body.appendChild(node);</script>"
    
    //console.log(form_element);
    html = html.replace("</body>", form_element+ "\n\n</body>");
    //console.log(html);
    return html;
}



function googleAnalyticsMiddleware(data) {
    if (data.contentType == 'text/html') {

        // https://nodejs.org/api/stream.html#stream_transform
        data.stream = data.stream.pipe(new Transform({
            decodeStrings: false,
            transform: function(chunk, encoding, next) {
                this.push(addGa(chunk.toString()));
                console.log(chunk.toString());
                next();
            }
        }));
    }
}

var unblockerConfig = {
    prefix: '/collaboration/',
    responseMiddleware: [
        googleAnalyticsMiddleware
    ]
};



// this line must appear before any express.static calls (or anything else that sends responses)
app.use(unblocker(unblockerConfig));


// this is for users who's form actually submitted due to JS being disabled or whatever
app.get("/no-js", function(req, res) {
    // grab the "url" parameter from the querystring
    var site = querystring.parse(url.parse(req.url).query).url;
    // and redirect the user to /proxy/url
    res.redirect(unblockerConfig.prefix + site);
});

app.get("/", function(req, res){
	res.render("index");
});










// ======================
// STARTING UP THE SETUP
// ======================
app.listen(4400, function(){
	console.log("Server running at url http://localhost:4400/ ");
});