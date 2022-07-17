// noinspection JSCheckFunctionSignatures

const {connect} = require("mongoose");
const { PASS } = require('./constants')

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000,
};

const url = `mongodb+srv://horbach:${PASS}@cluster0.ds5eo.mongodb.net/best-sale?retryWrites=true&w=majority`;

const database = async () => {
  return connect(url, options)
    .then(() => {
      console.log("MongoDB is connected");
    })
    .catch((err) => {
      console.log(err);
    });
};


module.exports = database;
