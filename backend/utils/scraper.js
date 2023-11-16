require("dotenv").config();

// const cheerio = require("cheerio");
// const axios = require("axios");
const puppeteer = require("puppeteer-core");

async function scrapeFlipkartProducts(url) {
  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BLESS_TOKEN}`,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();

    const proxyUrl = `https://api.scrape.do?token=${
      process.env.SCRAPEDO_API_KEY
    }&geoCode=in&url=${encodeURIComponent(url.trim())}`;

    console.log(proxyUrl);
    await page.goto(proxyUrl);
    await page.waitForXPath(
      "//div[@id='container']/div/div[3]/div[1]/div[2]/div[2]/div/div[1]/h1",
      {
        timeout: 20_000,
        // visible: true,
      }
    );
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
        let toGetImgUrlElse = elmStyles.backgroundImage || "";

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

        if (
          toGetImgUrlElse.indexOf(
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZmlsbC1vcGFjaXR5PSIuMDUiIGZpbGw9IiNGRkYiIGQ9Ik0wIDBoMnYySDB6Ii8+PHBhdGggZD0iTTAgMGgxdjFIMHoiIGZpbGw9IiM4REFDREEiLz48L2c+PC9zdmc+"
          ) != -1
        ) {
          imgElms.push(elm?.parentNode?.querySelector("img"));
        }

        if (elm?.tagName?.toLowerCase() === "h1") {
          productNameElms.push(elm);
        }

        if (
          elm?.innerHTML?.trim() == "Product Description" ||
          elm?.innerHTML?.trim() == "Product Details" ||
          elm?.innerHTML?.trim() == "Specifications"
        ) {
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
    await browser.close();

    return datas;
  } catch (err) {
    console.log(err);

    return null;
  }
}

module.exports = { scrapeFlipkartProducts };
