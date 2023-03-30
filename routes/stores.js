var express = require('express');
var router = express.Router();



var dbAPI = require('../DBAPI/db.js');

var storeMethods = require('../APILibrary/storeAPI');

var client = dbAPI.client;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hello Stores');
});

/* POST add data from scraper */
router.post('/adddata', async function(req, res, next) {
  
  const data = req.body;
   
   try{
     let confirm = await storeMethods.addDataScrapStore(client, data);
     res.json(confirm);
   }
   catch(err){
     res.status(400).json({message: err.message});
   }
   
 });

 /* GET data from db */
router.get('/getdata', async function(req, res, next) {

    
  try{
    let data = await storeMethods.getDataStore(client);
   
    res.json(data);
    
  }
  catch(err){
    res.status(400).json({message: err.message});
  }


});
module.exports = router;
