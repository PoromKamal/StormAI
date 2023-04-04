const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const dotenv = require("dotenv").config();

const PORT = process.env.PORT || 3001;
const stripe = require("./routes/stripe");

const app = express();
app.use(cors({
 // Set the origin of the frontend app
 credentials: true // Allow credentials to be sent with requests
}));

// Parse JSON-encoded request bodies
app.use(bodyParser.json());

// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/stripe", stripe);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});