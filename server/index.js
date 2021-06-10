const express = require('express');
const path = require('path');
const shortid = require('shortid');
const cors = require('cors');
const Razorpay = require('razorpay');
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
	key_id: process.env.RAZOR_PUBLIC_KEY,
	key_secret: process.env.RAZOR_SECRET_KEY
})

app.post('/razorpay/:amount', async (req, res) => {
	const payment_capture = 1
	const amount = (req.params.amount)*100;
	const currency = 'INR'

	const options = {
		amount,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error)
	}
})

app.listen(5000, () => {
	console.log('Listening on 5000')
})