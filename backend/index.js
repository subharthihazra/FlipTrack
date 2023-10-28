require("dotenv").config();

const express = require("express");
const app = express();

const { scrapeFlipkartProducts } = require("./utils/scraper");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/scrape", async (req, res) => {
  //   console.log(req.body.url);
  const data = await scrapeFlipkartProducts(req.body.url);
  if (data) {
    res.status(201).send(data);
  } else {
    res.status(500).send("Something went wrong!");
  }
});

app.listen(process.env.APP_PORT, function () {
  console.log(`App listening on port ${process.env.APP_PORT} ...`);
});
