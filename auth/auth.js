const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const knex = require('../databaseConnection').knex;
const config = require('./config');

/*          Register user (unique username only)     */
let registerUser = function (req, res) {
    let user = req.body;
    let hash = hashPassword(user.password);
    
    let searchQuery = `select * from users where username = '${user.username}'`;
    let insertQuery = `insert into users (username, email, password) values (
        '${user.username}', '${user.email}', '${hash}')`;

    knex.raw(searchQuery).then((usersArray) => {
        if(usersArray[0].length === 0){
            knex.raw(insertQuery).then((element) => {
                res.status(200).send({
                    resp: "register ok ",
                    element: element
                });
            }).catch((e) => {
                res.status(400).send({resp: "Error saving the user" })
            })
        } else {
            res.status(403).send({resp : "User already registered"})
        }
    })

    let token = generateJwt(user);
            res.status(200)
            .header('x-auth', token)
            .send({ auth: true, token:token });
};

let registerFacebook = function (req, res) {
    let user = req.body;
    let hash = hashPassword(user.password);
    
    let searchQuery = `select * from users where username = '${user.username}'`;
    let insertQuery = `insert into users (username, email, password) values (
        '${user.username}', '${user.email}', '${hash}')`;

    knex.raw(searchQuery).then((usersArray) => {
        if(usersArray[0].length === 0){
            knex.raw(insertQuery).then((element) => {
                console.log(element)
            }).catch((e) => {
                res.status(400).send({resp: "Error saving the user" })
            })
        } else {
            res.status(403).send({resp : "User already registered"})
        }
    })


}

let loginUser = function (req, res) {
    let user = req.body;
    let getDbPass = `select password from users where username = '${user.username}'`;

    knex.raw(getDbPass).then((result) => {

        let crypt = result[0][0].password;
        console.log(user.password, crypt);

        if(checkPassword(user.password, crypt)) {
            let token = generateJwt(user);
            res.status(200)
            .header('x-auth', token)
            .send({ auth: true, token:token });
        } else {
            res.status(403).send({
                err: "Wrong pass"
            })
        }
    })
}

let generateJwt = function(user){
    console.log(config.secret);
    return jwt.sign({
        username: user.username,
    }, config.secret, {expiresIn: '24h'});
}

let hashPassword = function(password) {
    return bcrypt.hashSync(password, 8);
}

let checkPassword = function(password, dbPass){
    return bcrypt.compareSync(password, dbPass);
}

module.exports = {registerUser, loginUser, registerFacebook};