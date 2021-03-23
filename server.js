const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/payment", require("./routes/payment"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("Server running on port 5000"));
