/*var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('Hello World!');
    res.end();
}).listen(8080);*/

var express = require('express');
require('dotenv').config();



var app = express();



async function main() {
    

   
    try {

         


        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Credentials", true);
            res.header("Access-Control-Allow-Origin", process.env.CORS_FRONTEND_URL);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
            });

        app.use(express.json())

        // setup store endpoint/route
        const storeRouter = require('./routes/stores')
        app.use('/stores', storeRouter)
        

        app.listen(process.env.PORT);
        console.log("listening on "+ process.env.PORT);


    } catch (e) {
        console.error(e);
    } 
 
}

main().catch(console.error);