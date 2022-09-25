const express = require('express'); 
const app = express();
const rateLimit = require('express-rate-limit')


app.get('/', function (req, res) {
	res.send('Hello World Express'); 
}); 

app.listen(3000);