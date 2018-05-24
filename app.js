const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config({ path: "variables.env" });
const PORT = process.env.PORT || 3000;
const subscriptionKey = process.env.key1;
let host = "api.cognitive.microsoft.com";
let path = "/bing/v7.0/images/search";
// loads up our variables.env into process.env
app.set('view engine','ejs');
app.get('/api/imagesearch/:term',(req,res)=>{
  axios
    .get(`https://${host}${path}?q=${encodeURIComponent(req.params.term)}`, {
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey
      }
    })
    .then(({ data:{value} }) => {
     res.json(value);
    })
    .catch(e => {
      console.log("Error =>", e);
    });
})

app.listen(PORT, () => {
  console.log(`Server is up an running on ${PORT}`);
});
