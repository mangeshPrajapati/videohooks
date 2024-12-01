const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const scrapeAllOgVideos = require("./src/utils/videoList");
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/hooks/videos", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.videosperpage) || 8;
  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;
  const videoUrls = await scrapeAllOgVideos();

  const paginatedVideos = await videoUrls.slice(startIndex, endIndex);

  res.json({
    videos: paginatedVideos,
    currentPage: page,
    totalVideos: videoUrls.length,
    totalPages: Math.ceil(videoUrls.length / perPage),
  });
  //   res.json(videoUrls);
});

app.get("/test", (req, res) => {
  res.send("Im good");
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
