import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from "@material-ui/core/styles";
import dotenv from 'dotenv';

dotenv.config();


const Styles = makeStyles((theme) => ({
    root: {
        width: "33%",
        height: 600,
        margin: 'auto',
        position: 'relative',
        top: 35,
        padding: '30px 0px 30px 0px'
    },
}));

export default function Donationcard() {
    const classes = Styles();
    const [name, setName] = useState("Swayam");
    const [amount, setAmount] = useState(" ");
    const url = process.env.REACT_APP_BASE_URL + amount;

    function validateForm() {
        const number = document.getElementById("contact").value;
        if(number.length < 10) {
            alert("Invalid Number")
        }
    }

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = src
            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }
            document.body.appendChild(script)
        })
    }

    async function displayRazorpay(e) {
        e.preventDefault();
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}

		// const data = await axios.post('http://localhost:5000/razorpay', amount);
        const data = await fetch(url, { method: 'POST' }).then((t) =>
			t.json()
		)
        
		console.log(data)

		const options = {
			key: process.env.REACT_APP_RAZOR_PUBLIC_KEY,
			currency: data.currency,
			amount: data.amount.toString(),
			order_id: data.id,
			name: 'Donation',
			description: 'Thank You for Donating',
			handler: function (response) {
				alert(response.razorpay_payment_id)
				alert(response.razorpay_order_id)
				alert(response.razorpay_signature)
			},
			prefill: {
				name,
			}
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
	}
    
    return (
        <section className="main">
            <Paper elevation={1} className={classes.root}>
                <h4 style={{textAlign: "center", margin:"0px 30px 0px 30px"}}>Kindly donate as much as you wish to help us provide oxygen cylinders to the needy covid patients</h4>
                <br />
                <form onSubmit={displayRazorpay}>
                <div class="mb-3" style={{width: "85%", margin: 'auto'}}>
                    <label class="form-label">Email address</label>
                    <input type="email" class="form-control" placeholder="Type Email here"/>
                </div>
                <div class="mb-3" style={{width: "85%", margin: 'auto'}}>
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" placeholder="Enter Your Name"/>
                </div>
                <div class="mb-3" style={{width: "85%", margin: 'auto'}}>
                    <label class="form-label">Contact No.</label>
                    <input id="contact" type="text" class="form-control" placeholder="Enter your active contact number"/>
                    <br />
                    <div class="form-text">We'll never share your provided information with anyone else.</div>
                </div>
                <div class="input-group mb-3" style={{width: "85%", margin: "auto"}}>
                    <span class="input-group-text">&#8377;</span>
                    <input type="text" class="form-control" value={amount} onChange={(e) => setAmount(e.target.value)}/>
                </div>
                <br />
                <div class="d-grid gap-2">
                    <button class="btn btn-primary" type="submit" style={{width: "85%", margin: "auto"}}>Donate</button>
                </div>
                </form>
            </Paper>
        </section>
    )
}
