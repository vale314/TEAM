const express = require("express");
const app = express();

const server = require("http").createServer(app);

// Init Middleware
app.use(express.json({ extended: false, limit: "5mb" }));

// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/register", require("./routes/register"));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
