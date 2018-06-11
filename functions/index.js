const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const config = require('./env');

admin.initializeApp(config);
const app = express();


app.get('/show', ( req , res ) => {
    admin.database().ref('/').once('value',snap => {
        res.send(snap.val());
        res.status(200).json({ message : '抓到資料' })
    })
});