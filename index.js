const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const database = require("./database");
const bootstrapService = require("./bootstrapService");

const PORT = process.env.PORT || 8082;

// Headers
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function start() {
  try {
    await database();

    await app.listen(PORT, async () => {
      console.log(`running Scrapper server on port ${PORT}`);
      bootstrapService();
    });
  } catch (e) {
    console.log('running Scrapper server ERROR :', e)
  }
}

return start();

