const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();
const SECRET = process.env.SECRET;

const authenticate = (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token , SECRET, (err, user)=>{
            if(err){
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    }else{
        res.sendStatus(401);
    }
};

module.exports = {
    SECRET,
    authenticate
}