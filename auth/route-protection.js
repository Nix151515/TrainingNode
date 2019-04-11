const jwt = require('jsonwebtoken');
const _ = require('lodash');
const config = require('./config');

let authenticate = (req, res, next) => {
    let token = req.headers['x-auth'] || req.headers['x-access-token'] ||
                req.body.token || req.query.token;
    if (!token) {
        return res.status(401).send("No token provided.");
    }

    console.log(token);
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(403).send("Failed to authenticate token.");
        }
    })
    console.log(" Accesed a protected page");
    next();
}

module.exports = {authenticate}