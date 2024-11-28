const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/route");

const app = express();

app.use(bodyParser.json());

// Use the router for API routes
app.use("/api", router);

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
