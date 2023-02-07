const customerModel = require('../models/customerModel');
const orderModel = require('../models/orderModel');
const jwt = require('jsonwebtoken');


const createCustomer = async (req, res) => {
    try {
        let data = req.body

        if(Object.keys(data).length==0) return res.status(400).send("please provide name,email,phone and password");

        let { name, email, phone, password,...a} = data;

        if(Object.keys(a).length!=0) return res.status(400).send("only name,email,phone and password is required");

        if (!email) return res.status(400).send("please provide email");
        if (!password) return res.status(400).send("please provide password");
        if (!name) return res.status(400).send("please provide name");
        if (!phone) return res.status(400).send("please provide phone");

        if (!email.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)) return res.status(400).send("invalid email");
        if (!password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/)) return res.status(400).send("invalid password");
        if (!phone.match(/^((\+91)?|91)?[6789][0-9]{9}$/g)) return res.status(400).send("invalid phone");
        if (!name.match(/^[A-Z a-z]+$/)) return res.status(400).send("invalid name");

        customer = await customerModel.findOne({email:email,phone:phone,isDeleted:false});
        if(customer){
            if(email==customer.email) return res.status(400).send("email already in use");
            if(phone==customer.phone) return res.status(400).send("phone already in use");
        }
        let createUser = await customerModel.create(data);
        let totalOrders = createUser._doc.totalOrders;
        let category = createUser._doc.category;

        res.status(201).send({ name, email, phone, password, totalOrders, category });

    } catch (err) {
        res.status(500).send(err.message);
    }
}

const customerLogin = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email) return res.status(400).send("please provide email");
        if (!password) return res.status(400).send("please provide password");

        if (!email.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)) return res.status(400).send("invalid email");
        if (!password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/)) return res.status(400).send("invalid password");

        let user = await customerModel.findOne({ email: email, password: password, isDeleted: false });
        if (!user) return res.status(401).send("incorrect email or password");

        let token = jwt.sign({ userId: user._id }, "very secret string");
        res.status(200).send({message:"ligin successful", token: token });

    } catch (err) {
        res.status(500).send(err.message);
    }
}

const createOrder = async (req, res) => {
    try {
        let token = req.headers.token;
        let varified =  jwt.verify(token, "very secret string",(err, decodedToken) => {
            if (err) {
                return res.status(400).send({ status: false, message: err.message })
            }
        });
        req.body.customerId = varified.userId;

        let data = req.body;
        if(Object.keys(data).length==0) return res.status(400).send("please provide productName and orderPrice");

        let {productName,orderPrice,customerId,...a} = data
        if(Object.keys(a).length!=0) return res.status(400).send("only productName and orderPrice is required");

        if (!productName) return res.status(400).send("please provide productName");
        if (!orderPrice) return res.status(400).send("please provide orderPrice");

        if (!productName.match(/^[A-Za-z]+|[A-Za-z]+\[0-9]+$/)) return res.status(400).send("invalid productName");
        if (!orderPrice.toString().match(/^(?:0|[1-9]\d*)(?:\.(?!.*000)\d+)?$/)) return res.status(400).send("invalid orderPrice");

        let user = await customerModel.findOneAndUpdate({ _id: varified.userId, isDeleted: false }, { $inc: { totalOrders: 1 } }, { new: true });
        if (!user) return res.status(404).send("user not found");

        let order = await orderModel.create(data);

        if (user.totalOrders < 10) {
            await customerModel.findOneAndUpdate({ _id: varified.userId, isDeleted: false }, { amount: user.amount + order.orderPrice }, { new: true });
        }
        if (user.totalOrders >= 10 && user.totalOrders < 20) {
            await customerModel.findOneAndUpdate({ _id: varified.userId, isDeleted: false }, { amount: user.amount + order.orderPrice*0.9, category: "gold" }, { new: true });
        }
        if (user.totalOrders >= 20) {
            await customerModel.findOneAndUpdate({ _id: varified.userId, isDeleted: false }, { amount: user.amount + order.orderPrice*0.8, category: "platinum" }, { new: true });
        }
        return res.status(201).send({message:"order placed successfully", orderDetails: order });

    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = { createCustomer, customerLogin, createOrder }