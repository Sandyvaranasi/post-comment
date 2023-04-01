const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');


const userLogin = async (req, res) => {
    try {
        let data = req.body

        if(Object.keys(data).length==0) return res.status(400).send("please provide name,email,phone and password");

         let { name, email, password} = data;

        if (!email) return res.status(400).send("please provide email");
        if (!password) return res.status(400).send("please provide password");
        if (!name) return res.status(400).send("please provide name");

        if (!email.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)) return res.status(400).send("invalid email");
        if (!password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/)) return res.status(400).send("invalid password");
        if (!name.match(/^[A-Z a-z]+$/)) return res.status(400).send("invalid name");

        let user = await userModel.findOne({ email: email, password: password });
        if (!user) {
            user = await userModel.create(data);
        }
        let token = jwt.sign({ userId: user._id }, "very secret string");
        return res.status(200).send({ message: "ligin successful",userId: user._id, token: token });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = { userLogin }
