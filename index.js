const express = require("express");
const app = express();

require("dotenv").config(); 
const PORT = process.env.PORT || 4000;

app.use(express.json());

// DB Connection
require("./Config/Database").connect();

// Routes
const user = require("./Route/user");
app.use("/api/v1", user);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});
