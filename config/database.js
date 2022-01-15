const mongoose = require("mongoose");

require("dotenv").config();

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
 * string into the `.env` file
 *
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 * DB_STRING_PROD=<your production database string>
 */

const devConnection =
  process.env.DB_STRING || "mongodb://localhost/ecommerceTest";
const prodConnection = process.env.DB_STRING_PROD;

const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

// Connect to the correct environment database
if (process.env.NODE_ENV === "production") {
  mongoose.connect(prodConnection, connectionOptions);

  mongoose.connection.on("connected", () => {
    console.log("Database connected");
  });
} else {
  mongoose.connect(devConnection, connectionOptions);

  mongoose.connection.on("connected", () => {
    console.log("Database connected");
  });
}
