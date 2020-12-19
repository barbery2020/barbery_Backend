const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

// Connect DB
connectDB();

// Init Middleware
//not needed if you are using body-parser
// app.use(express.json({ extended: false,  }));
app.use(express.json({ limit: "100mb" }));
app.use(
  express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 100000 })
);

app.get("/", (req, res) => {
  res.send("Welcome to the Barbery API...");
});

//Routes
app.use("/api/promo", require("./routes/promo"));
app.use("/api/adminAuth", require("./routes/adminAuth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/barberAuth", require("./routes/barberAuth"));
app.use("/api/barber", require("./routes/barber"));
app.use("/api/service", require("./routes/service"));
app.use("/api/package", require("./routes/package"));
app.use("/api/specialist", require("./routes/specialist"));
app.use("/api/appointment", require("./routes/appointment"));
app.use("/api/review", require("./routes/review"));
app.use("/api/collection", require("./routes/collection"));

// Serve static assets in production

// if (process.env.NODE_ENV === "production") {
//   // Set static folder

//   app.use(express.static("client/build"));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
//   );
// }
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
