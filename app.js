const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config({ path: "variables.env" });
const PORT = process.env.PORT || 3000;
const subscriptionKey = process.env.key1;
let host = "api.cognitive.microsoft.com";
let path = "/bing/v7.0/images/search";
// loads up our variables.env into process.env
const history = [];
app.set("view engine", "ejs");
app.get("/api/imagesearch/:term", (req, res) => {
  const { term } = req.params;
  const { offset } = req.query;
  history.push({ term, when: new Date() });
  const url = `https://${host}${path}?q=${encodeURIComponent(term)}&count=10&offset=${offset}`;
  console.log('Url=>',url);
  axios
    .get(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey
      }
    })
    .then(({ data: { value } }) => {
      const results = value.map(v => {
        return {
          thumbnailUrl: v.thumbnailUrl,
          url: v.contentUrl,
          snippet: v.name,
          context: v.hostPageUrl
        };
      });
      res.json(results);
    })
    .catch(e => {
      console.log("Error =>", e);
    });
});
app.get("/api/latest/imagesearch", (req, res) => {
  res.json(history);
});

app.listen(PORT, () => {
  console.log(`Server is up an running on ${PORT}`);
});
