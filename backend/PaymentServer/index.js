const express = require("express");

const cors = require("cors")


const PORT = process.env.PORT || 3001
const stripe = require("./routes/stripe")
class Room {
  constructor(user) {
    this.users = [user];
    this.paths = [];
  }
}

const app = express();
app.use(cors());
app.use("/api/stripe", stripe);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});