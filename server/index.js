const express = require("express");
const bodyParser = require("body-parser");
const Stripe = require("stripe");

const app = express();
const stripe = Stripe("your-secret-key-here"); // Replace with your Stripe secret key

app.use(bodyParser.json());

app.post("/api/create-onramp-session", async (req, res) => {
  try {
    const { transaction_details } = req.body;

    const session = await stripe.cryptoOnramp.sessions.create({
      transaction_details,
    });

    res.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Error creating onramp session:", error);
    res.status(500).send("Failed to create onramp session");
  }
});

//app.listen(port, () => {
//  console.log("Server running on http://localhost:port");
//});
