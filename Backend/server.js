const express = require('express');
const cors = require('cors');
const axios = require('axios');
const OAuthToken = require('./ebay_oauth_token');
const app = express();
const port = 3000;

app.use(cors());

const APP_ID = 'RiddhamG-CSCI571A-PRD-472b2ae15-4dc4edc3';

const client_id = 'RiddhamG-CSCI571A-PRD-472b2ae15-4dc4edc3';
const client_secret = 'PRD-72b2ae1509dc-c457-4c34-bf06-41f2';
const oauthToken = new OAuthToken(client_id, client_secret);

// Autocomplete route
app.get('/autocomplete', (req, res) => {
    const { zipCode } = req.query;
  
    // Make a request to the Geonames API for suggestions
    axios
      .get(
        `https://api.geonames.org/postalCodeSearchJSON?postalcode_startsWith=${zipCode}&maxRows=5&username=riddhamgadia&country=US`
      )
      .then((geonamesResponse) => {
        // Extract and send the suggestions as JSON response
        const suggestions = geonamesResponse.data.postalCodes.map((item) => item.postalCode);
        res.json(suggestions);
      })
      .catch((error) => {
        // Handle errors gracefully
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching suggestions for zipcode.' });
      });
});


app.get('/search', (req, res) => {
  const { keyword, buyerpostalcode, maxdistance, freeshipping, localpickup, condition } = req.query;
  let apiUrl = `https://svcs.ebay.com/services/search/FindingService/v1?paginationInput.entriesPerPage=50&OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${APP_ID}&RESPONSE-DATA-FORMAT=JSON`;
  if (keyword) {
    apiUrl += `&keywords=${encodeURIComponent(keyword)}`;
  }
  if (buyerpostalcode) {
    apiUrl += `&buyerPostalCode=${encodeURIComponent(buyerpostalcode)}`;
  }
  let itemFilterIndex = 0;
  if (maxdistance) {
      apiUrl += `&itemFilter(${itemFilterIndex}).name=MaxDistance&itemFilter(${itemFilterIndex}).value=${encodeURIComponent(maxdistance)}`;
      itemFilterIndex++;
  }
  if (freeshipping) {
    apiUrl += `&itemFilter(${itemFilterIndex}).name=FreeShippingOnly&itemFilter(${itemFilterIndex}).value=true`;
    itemFilterIndex++;
  }
  if (localpickup) {
    apiUrl += `&itemFilter(${itemFilterIndex}).name=LocalPickupOnly&itemFilter(${itemFilterIndex}).value=true`;
    itemFilterIndex++;
  }
  // Add Condition item filter if condition is provided. Here, we assume 'condition' could be an array.
  if (condition && Array.isArray(condition)) {
    apiUrl += `&itemFilter(${itemFilterIndex}).name=Condition`;
    condition.forEach((cond, idx) => {
        apiUrl += `&itemFilter(${itemFilterIndex}).value(${idx})=${encodeURIComponent(cond)}`;
    });
    itemFilterIndex++;
  }
  // Always add the HideDuplicateItems filter
  apiUrl += `&itemFilter(${itemFilterIndex}).name=HideDuplicateItems&itemFilter(${itemFilterIndex}).value=true`;
  itemFilterIndex++;
  apiUrl += `&outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo`;
  axios
  .get(apiUrl)
  .then((response) => {
    res.json(response.data);
  })
  .catch((error) => {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching eBay products in search route.' });
  });

});
app.get('/product', (req, res) => {
  oauthToken.getApplicationToken()
    .then((accessToken) => {
        const {itemid} = req.query;

        const url = `https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=${APP_ID}&siteid=0&version=967&ItemID=${itemid}&IncludeSelector=Description,Details,ItemSpecifics`;

        const headers = {
            "X-EBAY-API-IAF-TOKEN": accessToken
        };

        axios.get(url, { headers: headers })
            .then(response => {
                res.json(response.data);
            })
            .catch(error => {
                console.error('Error:', error.message);
                res.status(500).send('Error fetching item from eBay.');
            });
    })
    .catch((error) => {
          console.error('Error:', error);
    });
});

app.get('/getSimilarItems', (req, res) => {
  const { itemId } = req.query;

  // Construct the full URL for eBay API
  const apiUrl = `https://svcs.ebay.com/MerchandisingService?OPERATION-NAME=getSimilarItems&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0&APP_ID=${APP_ID}&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&itemId=${itemId}&maxResults=20`;

  axios.get(apiUrl)
      .then(response => {
          res.json(response.data);
      })
      .catch(error => {
          console.error('Error fetching similar items from eBay:', error.message);
          res.status(500).json({ error: 'An error occurred while fetching similar items from eBay.' });
      });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });