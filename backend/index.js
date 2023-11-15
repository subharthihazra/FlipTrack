require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const { scrapeFlipkartProducts } = require("./utils/scraper");

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const dummy_data = {
  price: 1706,
  priceOriginal: 3500,
  imgUrl:
    "https://rukminim2.flixcart.com/image/416/416/l2jcccw0/memory-card/sdxc-uhs-i-card/6/b/c/sdsqua4-256g-gn6mn-sandisk-original-imagdv34rzuhp9f2.jpeg?q=70",
  productName: "SanDisk Ultra 256 GB MicroSDXC Class 10 150 MB/s Memory Card",
  productDescription:
    "Specifications General Sales Package 1 Ultra MicroSDXC Card Pack of 1 Series Ultra Model Number SDSQUAC-256G-GN6MN W x H x D 14.99 mm x 10.92 mm x 1.02 mm Weight 4.54 g Net Quantity 1 Warranty Covered in Warranty Manufacturing Defects Warranty Service Type Carry-in Not Covered in Warranty Physical Damage Warranty Summary 10 Years Warranty Domestic Warranty 10 Year Read More",
};

app.post("/scrape", async (req, res) => {
  //   console.log(req.body.searchUrl);
  // data = dummy_data;
  const data = await scrapeFlipkartProducts(req.body.searchUrl || "");

  if (data) {
    res.status(201).send(data);
  } else {
    res.status(500).send("Something went wrong!");
  }
});

app.listen(process.env.APP_PORT, function () {
  console.log(`App listening on port ${process.env.APP_PORT} ...`);
});
