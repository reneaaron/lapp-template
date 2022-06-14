const axios = require("axios");
const lnurlPay = require("lnurl-pay");
const qrcode = require("qrcode");

function setupPay(app) {
  
  app.post("/invoice", async function (req, res) {
    try {
      var options = {
        method: 'POST',
        url: 'https://getalby.com/api/invoices',
        headers: {
          'LIGHTNING-ADDRESS': process.env.ALBY_LIGHTNING_ADDRESS,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: {amount: req.body.amount, memo: req.body.comment ? req.body.comment : "" }
      };
      
      const result = await axios.request(options);
  
      res.json({
        payment_hash: result.data.payment_hash,
        payment_request: result.data.payment_request,
        qrCode: result.data.qr_code_svg,
      });
    }
    catch(e)
    {
      console.error(e);
    }
  });

  // Endpoint for checking if an invoice has been paid
  app.get("/invoice/:paymentHash", async function (req, res) {

    try {

      const request = await axios.get(
        `https://getalby.com/api/invoices/${req.params.paymentHash}`,
        {
          headers: {
            "Accept": "application/json",
          },
        }
      );

      res.json({
        paid: request.data.settled,
      });
    }
    catch(e){
      console.error(e);
    }
  });
}

module.exports = { setupPay: setupPay };