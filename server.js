const express = require("express");
const app = express();

const server = require("http").createServer(app);

// Init Middleware
app.use(express.json({ extended: false, limit: "5mb" }));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
