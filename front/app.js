var koa = require('koa');
var app = koa();

// var bodyParser = require('body-parser');
// var morgan = require('morgan';)

var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:4444/test';
var _db;

app.use(morgan('dev'));
app.use(bodyParser.json());

MongoClient.connect(mongoUrl, function(err, db){
    if (err) {
        console.log(err);
        return;
    }
    console.log('connected to mongo');
	_db = db;
	app.listen(8888, function () {
	    console.log('server is running...');
	});
})
