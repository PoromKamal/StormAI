const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();
const stripe = Stripe(''); // Add your Stripe Secret Key here
const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {

  console.log(req.body.email);
  const email = req.body.email;
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: "AI"
            },
            unit_amount: 4999,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5500/upgradeUser',
      cancel_url: 'http://localhost:3000'
    });
  
    res.send({url: session.url});
  });

module.exports = router;
