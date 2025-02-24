const express = require("express");

const router = express.Router();

const { validatorRegister, validatorLogin} = require("../validators/auth.js");
const { matchedData } = require("express-validator");


router.post("/register", validatorRegister, (req, res) =>{
    req = matchedData(req);
    res.send(req)
})

router.post("/login", validatorLogin, (req, res) =>{
    req = matchedData(req);
    res.send(req)
})

module.exports = router