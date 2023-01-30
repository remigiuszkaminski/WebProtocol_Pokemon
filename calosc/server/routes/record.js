const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

const bcrypt = require("bcrypt");
const saltRounds = 10;

recordRoutes.route("/register").post(function (req, res) {
    let db_connect = dbo.getDb("uzytkownicy");
    db_connect.collection("users").findOne({ email: req.body.email }, function (err, result) {
        if (err) throw err;
        if (result) {
            res.json({ message: "Email juz uzyty" });
        } else {
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                let myobj = {
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                };
                db_connect.collection("users").insertOne(myobj, function(err, result) {
                    if (err) throw err;
                    console.log('Zarejestrowano uzytkownika: ' + myobj.name + '')
                });
                res.json({ message: "User added successfully" });
            });            
        }
    });
});


recordRoutes.route("/login").post(function (req, res) {
    let db_connect = dbo.getDb("uzytkownicy");
    let myobj = {
        email: req.body.email,
    };
    db_connect.collection("users").findOne(myobj, function (err, result) {
        if (err) throw err;
        if (result) {
            bcrypt.compare(req.body.password, result.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    res.json(result)
                    console.log(`user ${myobj.email} logged in`)
                } else {
                    res.json({ message: "Incorrect password" });
                }
            });
        } else {
            res.json({ message: "User not found" });
        }
    });
});



recordRoutes.route("/getallusers").get(function(req, res) {
    let db_connect = dbo.getDb("uzytkownicy");
    db_connect.collection("users").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});

recordRoutes.route("/getallusers/:search").get(function(req, res) {
    let db_connect = dbo.getDb("uzytkownicy");
    let myquery = { name: { $regex: req.params.search, $options: "i" } };
    db_connect
        .collection("users")
        .find(myquery)
        .toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
        });
});

recordRoutes.route("/deleteuser/:id").delete(function(req, res) {
    let db_connect = dbo.getDb("uzytkownicy");
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("users").deleteOne(myquery, function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});


recordRoutes.route("/updateuser/:id").put(function(req, res) {
    let db_connect = dbo.getDb("uzytkownicy");
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
        $set: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
    };
    db_connect.collection("users").updateOne(myquery, newvalues, function(err, result) {
        if (err) throw err;
        console.log( "User updated, his name is now: " + req.body.name +"")
    });
    res.json({ message: "User updated successfully" })
});


recordRoutes.route("/create").post(function (req, res) {
    let db_connect = dbo.getDb("pokemony");
    let myobj = {
        name: req.body.name,
        type: req.body.type,
        level: req.body.level,
        owner: req.body.owner,
        image: req.body.image
    };
    db_connect.collection("pokemony").insertOne(myobj, function(err, result) {
        if (err) throw err;
        console.log('Dodano pokemona: ' + myobj.name + '')
    });
    res.json({ message: "Pokemon added successfully" });
});


recordRoutes.route("/getall").get(function(req, res) {
    let db_connect = dbo.getDb("pokemony");
    db_connect.collection("pokemony").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});
    

recordRoutes.route("/update/:id").put(function(req, res) {
    let db_connect = dbo.getDb("pokemony");
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
        $set: {
            name: req.body.name,
            type: req.body.type,
            level: req.body.level,
            owner: req.body.owner,
            image: req.body.image
        }
    };
    db_connect.collection("pokemony").updateOne(myquery, newvalues, function(err, result) {
        if (err) throw err;
        console.log( "Pokemon updated, his name is now: " + req.body.name +"")
    });
    res.json({ message: "Pokemon updated successfully" })
});


recordRoutes.route("/delete/:id").delete(function(req, res) {
    let db_connect = dbo.getDb("pokemony");
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("pokemony").deleteOne(myquery, function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});









module.exports = recordRoutes;
