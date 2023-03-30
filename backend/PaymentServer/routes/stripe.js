const React = require('react');
const { useState, useEffect } = React;
const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();
const stripe = Stripe('sk_test_51Mo85AIVRL6VSZLJkWpWUVS8yyZmYyXkXEho6IQbKKdKgzHe7z4oS0uzwbiKy5JOhMxI7T7FeVyMalX1P2Chl7F0002qEkw34C');;
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
