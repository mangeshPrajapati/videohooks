const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();

// Define the URL
const url = process.env.API_URL;

// Function to scrape all og:video meta tags
const scrapeAllOgVideos = async () => {
  try {
    // Fetch the HTML content of the page
    const { data } = await axios.get(url);

    // Load the HTML into Cheerio
    const $ = cheerio.load(data);

    // Find all meta tags with property 'og:video'
    const ogVideoUrls = [];

    $('meta[property="og:video"]').each((index, element) => {
      const content = $(element).attr("content");
      if (content) {
        ogVideoUrls.push(content);
      }
    });
    return ogVideoUrls;
  } catch (error) {
    console.error("Error scraping the page:", error.message);
  }
};
// scrapeAllOgVideos();
module.exports = scrapeAllOgVideos;
