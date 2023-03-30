
module.exports = 
{

    //add data from scraper to database
    addDataScrapStore: async function addDataScraper(client, data) {


        /*
            data in this format
            {
                "stores": [
                {
                    "Company": "Target",
                    "Zip_code": "21224-5750",   
                    "Address_line1": "3559 Boston Street",
                    "Address_line2": "",
                    "City": "Baltimore",
                    "State": "MD",
                    "Country": "US",
                    "Longitude": 39.275284,
                    "Latitude": -76.565947,
                    "Store_name": "Baltimore East",
                    "Store_id": 2845,
                    "Store_items": [
                        {
                           "Product_id": "0",
                           "Product_family": "Bobbie",
                           "Product": "Bobbie Baby Organic Powder Infant Formula - 14oz",
                            "Price": 25.99,
                         "Availability": "IN_STOCK",
                            "Quantity": -1,
                            "Product_url": "https://www.target.com/p/bobbie-baby-organic-powder-infant-formula-14oz/-/A-85776110",
                            "Product_img_url": "https://target.scene7.com/is/image/Target/GUEST_a47d490d-8dca-4c78-9993-07a4e630445a"
                        }
                    
                    ]
                }
            }
        ]
    
    
    
    
    
        */
    
    
        const DB = client.db('Stores');
        
    
    
        const collection = await DB.collection('Stores'); // or DB.createCollection(nameOfCollection);
        
    
        //clear out the Stores database
        await collection.remove({})
    
        //add Store_Id and Company Field to every item listing
        for (x in data.stores) {
        
            let store_Id = data.stores[x].Store_id;
            let company = data.stores[x].Company;
        
            data.stores[x].Store_items.forEach((node) => node.Store_id = store_Id);
            data.stores[x].Store_items.forEach((node) => node.Company = company);
    
            
        }
        var ratingsList = new Array();
        //ratingsList.List = [];
        //filter through list of store items and add the iemt to Ratings database if it is not already there
        for (store in data.stores) {
    
            for (item in data.stores[store].Store_items) {
                let thing = data.stores[store].Store_items[item];
                

                ratingsList.push(thing);

                
                  
            }
    
    
    
        }
        
        
        try{

            await fetch('http://localhost:8083/ratings/adddata', {
                    method: 'Post',
                    body: JSON.stringify(ratingsList), // string or object
                    headers: {
                        'Content-Type': 'application/json'
                    }
                
                  });
                  
            

        }
        catch(err)
        {
            throw  new Error(err);
        }
        
    
        try{
            await collection.insert(data);
            var returnJson = new Object();
             
            returnJson.addedData = true;
                
                
            return returnJson;
        }
        catch(err)
        {
            throw  new Error(err);
        }
        
        
    },
    //function to retrive data for frontend
    getDataStore: async function get_data(client)
    {


        const DB = client.db('Stores');

        //const DB2 = client.db('Ratings');



        const collection = await DB.collection('Stores'); // or DB.createCollection(nameOfCollection);

        //const collection2 = await DB2.collection('Ratings'); // or DB.createCollection(nameOfCollection);
        //get list of items in stores
        let findResult = await collection.findOne(
            // 'stores' : { 'Store_id': "2845" }
            //{Company: "Target", Product_id: "0",  Store_id: 2845 }
        
        );
    
        //merge the entries in Ratings with the coresponding item in store list
        for (store in findResult.stores) {

            for (item in findResult.stores[store].Store_items) {
                let thing = findResult.stores[store].Store_items[item];
                
                let response = await fetch('http://localhost:8083/ratings/findRate', {
                    method: 'Post',
                    body: JSON.stringify(thing), // string or object
                    headers: {
                        'Content-Type': 'application/json'
                    }
                
                  });
                  const rating = await response.json(); //extract JSON from the http response
                    // do something with myJson
                 

                findResult.stores[store].Store_items[item] = rating;
            }



        }
        
        return findResult;

}
}