const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const fs = require("fs");
const util = require("util");

const log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });
const log_stdout = process.stdout;

console.log = function (d) {
    log_file.write(util.format(d) + "\n");
    log_stdout.write(util.format(d) + "\n");
};

const bcrypt = require("bcrypt");
const saltRounds = 10;

recordRoutes.route("/register").post(function (req, res) {
    let db_connect = dbo.getDb("uzytkownicy");
    db_connect.collection("users").findOne({ $or: [{ email: req.body.email }, { name: req.body.name }] }, function (err, result) {
        if (err) throw err;
        if (result) {
            res.json({ message: "Email lub nazwa juz uzyta" });
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


recordRoutes.route("/getuser/:id").get(function(req, res) {
    let db_connect = dbo.getDb("uzytkownicy");
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("users").find(myquery).toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});


recordRoutes.route("/updateuserpassword/:id").put(function(req, res) {
    let db_connect = dbo.getDb("uzytkownicy");
    let myquery = { _id: ObjectId(req.params.id) };
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        let newvalues = {
            $set: {
                password: hash
            }
        };
        db_connect.collection("users").updateOne(myquery, newvalues, function(err, result) {
            if (err) throw err;
            console.log( "User password updated")
        });
        res.json({ message: "User password updated successfully" })
    });
});

recordRoutes.route("/create").post(function (req, res) {
    let db_connect = dbo.getDb("pokemony");
    let myobj = {
        name: req.body.name,
        type: req.body.type,
        level: req.body.level,
        owner: req.body.owner,
        image: req.body.image,
        opinions: []
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

recordRoutes.route("/getall/:search").get(function(req, res) {
    let db_connect = dbo.getDb("pokemony");
    let myquery = { name: { $regex: req.params.search, $options: "i" } };
    db_connect
        .collection("pokemony")
        .find(myquery)
        .toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
        });
});


recordRoutes.route("/getpokemon/:id").get(function(req, res) {
    let db_connect = dbo.getDb("pokemony");
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect
        .collection("pokemony")
        .find(myquery)
        .toArray(function(err, result) {
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


recordRoutes.route("/addopinion/:id").put(function(req, res) {
    let db_connect = dbo.getDb("pokemony");
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
        $push: {
            opinions: {
                name: req.body.name,
                opinion: req.body.opinion
            }
        }
    };
    db_connect.collection("pokemony").updateOne(myquery, newvalues, function(err, result) {
        if (err) throw err;
        console.log( "Opinion added")
    });
    res.json({ message: "Opinion added successfully" })
});


recordRoutes.route("/deleteopinion/:id").put(function(req, res) {
    let db_connect = dbo.getDb("pokemony");
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
        $pull: {
            opinions: {
                name: req.body.name,
                opinion: req.body.opinion
            }
        }
    };
    db_connect.collection("pokemony").updateOne(myquery, newvalues, function(err, result) {
        if (err) throw err;
        console.log( "Opinion deleted")
    });
    res.json({ message: "Opinion deleted successfully" })
});




recordRoutes.route("/delete/:id").delete(function(req, res) {
    let db_connect = dbo.getDb("pokemony");
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("pokemony").deleteOne(myquery, function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});


recordRoutes.route("/createblogopinion").post(function (req, res) {
    let db_connect = dbo.getDb("pokemony");
    let myobj = {
        name: req.body.name,
        opinion: req.body.opinion
    };
    db_connect.collection("opinions").insertOne(myobj, function(err, result) {
        if (err) throw err;
        console.log('Dodano opinie: ' + myobj.name + '')
    });
    res.json({ message: "Opinion added successfully" });
});



recordRoutes.route("/getallblogopinions").get(function(req, res) {
    let db_connect = dbo.getDb("pokemony");
    db_connect.collection("opinions").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});


recordRoutes.route("/deleteblogopinion/:id").delete(function(req, res) {
    let db_connect = dbo.getDb("pokemony");
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("opinions").deleteOne(myquery, function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});


recordRoutes.route("/updateblogopinion/:id").put(function(req, res) {
    let db_connect = dbo.getDb("pokemony");
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
        $set: {
            name: req.body.name,
            opinion: req.body.opinion
        }
    };
    db_connect.collection("opinions").updateOne(myquery, newvalues, function(err, result) {
        if (err) throw err;
        console.log( "Opinion updated, now it looks like: " + req.body.opinion +"")
    });
    res.json({ message: "Opinion updated successfully" })
});




recordRoutes.route("/createnewlocation").post(function(req, res) {
    let db_connect = dbo.getDb("pokemony");
    let myobj = {
        name: req.body.name,
        terrain: req.body.terrain,
        arealevel: req.body.arealevel,
        owner: req.body.owner,
        image: req.body.image
    };
    db_connect.collection("locations").insertOne(myobj, function(err, result) {
        if (err) throw err;
        console.log('Dodano lokacje: ' + myobj.name + '')
    });
    res.json({ message: "Location added successfully" });
});


recordRoutes.route("/getalllocations").get(function(req, res) {
    let db_connect = dbo.getDb("pokemony");
    db_connect.collection("locations").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});


recordRoutes.route("/getlocation/:id").get(function(req, res) {
    let db_connect = dbo.getDb("pokemony");
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("locations").find(myquery).toArray(function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});


recordRoutes.route("/updatelocation/:id").put(function(req, res) {
    let db_connect = dbo.getDb("pokemony");
    let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
        $set: {
            name: req.body.name,
            terrain: req.body.terrain,
            arealevel: req.body.arealevel,
            owner: req.body.owner,
            image: req.body.image
        }
    };
    db_connect.collection("locations").updateOne(myquery, newvalues, function(err, result) {
        if (err) throw err;
        console.log( "Location updated" + "")
    });
    res.json({ message: "Location updated successfully" })
});


recordRoutes.route("/deletelocation/:id").delete(function(req, res) {
    let db_connect = dbo.getDb("pokemony");
    let myquery = { _id: ObjectId(req.params.id) };
    db_connect.collection("locations").deleteOne(myquery, function(err, result) {
        if (err) throw err;
        res.json(result);
    });
});








module.exports = recordRoutes;
