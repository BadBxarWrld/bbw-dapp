require("dotenv").config();
const express = require("express");
const app = express();
const path = require('node:path');
const cors = require('cors');

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_API_DEV_KEY);
const OnrampSessionResource = Stripe.StripeResource.extend({
  create: Stripe.StripeResource.method({
    method: 'POST',
    path: 'crypto/onramp_sessions',
  }),
});

app.use(cors({ origin: "https://dapp.badbxar.com" })); // allow requests from React dev server (localhost:port)
app.use(express.static("public"));
app.use(express.json());

app.post("/create-onramp-session", async (req, res) => {
  const { transaction_details } = req.body;

  // Create an OnrampSession with the order amount and currency
  const onrampSession = await new OnrampSessionResource(stripe).create({
    transaction_details: {
      destination_currency: transaction_details["destination_currency"],
      destination_exchange_amount: transaction_details["destination_exchange_amount"],
      destination_network: transaction_details["destination_network"],     
    },
    customer_ip_address: req.socket.remoteAddress,
  });

  res.send({
    clientSecret: onrampSession.client_secret,
  });
});

app.get('/onramp', (req, res) => {
  res.sendFile(path.join(__dirname, '/../public/onramp.html'));
});

//app.listen(port, () => console.log("Node server listening on port #!"));