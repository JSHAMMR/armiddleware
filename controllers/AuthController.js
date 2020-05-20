
'use strict';

const Bcrypt = require('bcryptjs'); // encrypt password
const conn = require('../DbConfig.js');

//login
exports.login = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    conn.query('SELECT * FROM users WHERE username = ?', [username], function (error, results) {
        if (error) {
            res.status(400).send({ error: true, message: 'Successful logout' });
        } else {
            if (results.length > 0) {
                // Compare password in database
                Bcrypt.compare(password, results[0].password, function (err, ress) {
                    if (!ress) {
                        res.status(400).send({ error: true, message: 'Not found' });
                    } else {
                        req.session.loggedin = true;
                        req.session.username = username;
                        res.status(200).send({ error: false, message: 'Successful login' });
                    }
                });
            }
            else {
                res.status(400).send({ error: true, message: 'Does not exist' });
            }
        }
    });
}

//logout
exports.logout = function(req,res){
    try{
        if (req.session) {
            // delete session object
            req.session.destroy(function(err) {
              if(err) {
                res.status(400).send({status:400, error: true, message: err});
              } else {
                res.status(200).send({status:200,error: false, message: 'Successful logout'});
              }
            });
          }
    }catch(err){
        throw new Error(err.message);
    }

}
