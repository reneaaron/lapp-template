const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const { setupAuth } = require("./auth.js");
const { setupPay } = require("./pay.js");

// Validate configuration
if (!process.env.ALBY_LIGHTNING_ADDRESS) {
  console.error(
    "You need to configure your environment variables first. Check out the README file!"
  );
  process.exit(1);
}

const app = express();

app.use(bodyParser.json());

app.use(expressLayouts);
app.use('/js', express.static('src/js'));
app.use(express.static('public'));

app.set("view engine", "ejs");
app.set("views", "src/views");

// Setup authentication, register routes & session handling
setupAuth(app);

// Setup payment APIs for invoice generation & more 🚀
setupPay(app);

// Your application routes go here 👇
app.get("/", function (req, res) {
  return res.render("index", {
    user: req.user
  });
});

app.get("/pay", function (req, res) {
  return res.render("pay", {
    user: req.user,
  });
});

app.get("/scroll", function (req, res) {
  return res.render("scroll", {
    user: req.user
  });
});

// Start express on the defined port
app.listen(process.env.PORT || 3000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`)
);
