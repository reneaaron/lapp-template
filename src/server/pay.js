const axios = require("axios");
const lnurlPay = require("lnurl-pay");
const qrcode = require("qrcode");

function setupPay(app) {
  app.get("/pay", function (req, res) {
    return res.render("pay", {
      user: req.user,
    });
  });

  app.post("/invoice", async function (req, res) {
    const result = await axios.post(
      `${process.env.LNBITS_URL}/api/v1/payments`,
      {
        unit: "sat",
        out: false,
        amount: req.body.amount,
        memo: req.body.comment ? req.body.comment : "",
      },
      {
        headers: {
          "X-Api-Key": process.env.LNBITS_INVOICE_KEY,
          "Content-type": "application/json",
        },
      }
    );

    res.json({
      payment_hash: result.data.payment_hash,
      payment_request: result.data.payment_request,
      qrCode: await qrcode.toDataURL(result.data.payment_request.toUpperCase())
    });
  });

  // Endpoint for checking if an invoice has been paid
  app.get("/invoice/:paymentHash", async function (req, res) {
    const request = await axios.get(
      `${process.env.LNBITS_URL}/api/v1/payments/${req.params.paymentHash}`,
      {
        headers: {
          "X-Api-Key": process.env.LNBITS_INVOICE_KEY,
          "Content-type": "application/json",
        },
      }
    );

    res.json({
      paid: request.data.paid,
    });
  });
}

module.exports = { setupPay: setupPay };