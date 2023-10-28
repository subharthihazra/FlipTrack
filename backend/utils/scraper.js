require("dotenv").config();

// const cheerio = require("cheerio");
// const axios = require("axios");
const puppeteer = require("puppeteer");

async function scrapeFlipkartProducts(url) {
  // const username = String(process.env.BRIGHT_DATA_USERNAME);
  // const password = String(process.env.BRIGHT_DATA_PASSWORD);
  // const port = 22225;
  // const sessionId = (1000000 * Math.random()) | 0;

  // const options = {
  //   auth: {
  //     username: `${username}-session-${sessionId}`,
  //     password,
  //     host: "brd.superproxy.io",
  //     port,
  //     rejectUnauthorized: false,
  //   },
  // };

  // try {
  //   const response = await axios.get(url, options);
  //   const $ = cheerio.load(response.data);
  //   // console.log(response);

  //   const priceElms = $("._30jeq3._16Jk6d");
  //   const price = $("._30jeq3._16Jk6d").text().trim();

  //   const fontSize = document.defaultView.getComputedStyle(priceElms);

  //   return price;
  // } catch (err) {
  //   console.log(err);
  // }

  try {
    const browser = await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true,
      // args: ["--headless=new"],
    });
    const page = await browser.newPage();
    // const proxy = `https://proxybot.io/api/v1/${process.env.PROXYBOT_API_KEY}?geolocation_code=in&url=`;
    // const proxyUrl = `${proxy}${encodeURIComponent(url.trim())}`;

    const proxyUrl = `https://api.scrape.do?token=${
      process.env.SCRAPEDO_API_KEY
    }&geoCode=in&url=${encodeURIComponent(url.trim())}`;

    console.log(proxyUrl);
    await page.goto(proxyUrl);
    await page.waitForSelector("#container > div", {
      // waitUntil: "domcontentloaded",
      timeout: 20_000,
    });
    let datas = await page.evaluate(() => {
      let elms = document.querySelectorAll("#container *");
      let priceElms = [];
      let priceOriginalElms = [];
      let imgElms = [];
      let productNameElms = [];
      let productDescriptionElms = [];

      Array.prototype.forEach.call(elms, function (elm) {
        let elmStyles = document.defaultView.getComputedStyle(elm);
        let toGetPrice = elmStyles.fontSize || "";
        let toGetPriceOriginal = elmStyles.textDecoration || "";
        let toGetImgUrl = elmStyles.cursor || "";

        if (toGetPrice.indexOf("28px") != -1) {
          priceElms.push(elm);
        }

        if (toGetPriceOriginal.indexOf("line-through") != -1) {
          priceOriginalElms.push(elm);
        }

        if (elm?.tagName?.toLowerCase() === "img") {
          if (toGetImgUrl.indexOf("crosshair") != -1) {
            imgElms.push(elm);
          }
        }

        if (elm?.tagName?.toLowerCase() === "h1") {
          let productNameSpan = elm.querySelector("span");
          if (productNameSpan !== undefined) {
            productNameElms.push(productNameSpan);
          }
        }

        if (elm?.innerHTML?.trim() == "Product Description") {
          productDescriptionElms.push(elm?.parentNode?.parentNode);
        }
      });
      return {
        price: parseFloat(
          priceElms[0]?.innerText?.trim()?.replace(/[^0-9.]/g, "")
        ),
        priceOriginal: parseFloat(
          priceOriginalElms[0]?.innerText?.trim()?.replace(/[^0-9.]/g, "")
        ),
        imgUrl: imgElms[0]?.src?.trim(),
        productName: productNameElms[0]?.innerText?.trim(),
        productDescription: productDescriptionElms[0]?.innerText
          ?.replace("Product Description", "")
          ?.replace("View all features", "")
          ?.trim(),
      };
    });
    console.log(datas);
    // await browser.close();

    return datas;
  } catch (err) {
    console.log(err);

    return null;
  }
}

module.exports = { scrapeFlipkartProducts };
