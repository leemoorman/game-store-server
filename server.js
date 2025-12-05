const express = require("express");
const app = express();
const cors = require('cors');
const multer = require("multer");
const Joi = require("joi")
const mongoose = require("mongoose");
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./public/console-images");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

const upload = multer ({storage: storage});

mongoose
  .connect("mongodb+srv://leemoorman3_db_user:thisisapassword@cluster0.cfmxjey.mongodb.net/gamestore?appName=Cluster0")
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("could not connect ot mongodb...", err));

const consoleSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  description: String,
  rating: Number,
  img: String,
});

const gameConsole = mongoose.model("Console", consoleSchema);

app.get("/api/consoles", async(req, res) =>{
    const consoles = await gameConsole.find();
    console.log(consoles);
    res.send(consoles);
});

app.post("/api/consoles", upload.single("img"), async(req, res) =>{
    console.log("in post request");
    const result = validateConsole(req.body);

    if(result.error){
        console.log("ERROR");
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const game_console = new gameConsole({
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        description: req.body.description,
        rating: req.body.rating,
    });

    if(req.file){
        game_console.img = req.file.filename;
    }

    const newConsole = await game_console.save();
    res.status(200).send(newConsole);
});

app.put("/api/consoles/:id", upload.single("img"), async(req, res) =>{
    //let game_console = consoles.find((c) => c._id === parseInt(req.params.id));

    //if (!game_console) res.status(404).send("No Console with that ID");

    const result = validateConsole(req.body);

    if(result.error){
        console.log('Invalid Info');
        res.status(400).send(result.error.details[0].message);
        return;
    }

    let toUpdate = {
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        description: req.body.description,
        rating: req.body.rating,
    };

    if(req.file){
        toUpdate.img = req.file.filename;
    }

    const updateThrough = await gameConsole.updateOne(
        { _id: req.params.id },
        toUpdate
    );

    const updatedConsole = await gameConsole.findOne({_id: req.params.id});
    res.send(updatedConsole);
});

app.delete("/api/consoles/:id", async(req, res) =>{
    const game_console = await gameConsole.findByIdAndDelete(req.params.id);
    
    if(!game_console){
        res.status(404).send('The console with the given id was not found');
        return;
    }

    res.status(200).send(game_console);
});

const validateConsole = (game_console) =>{
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        price: Joi.number().required(),
        stock: Joi.number().required(),
        rating: Joi.number().required(),
        description: Joi.string().min(3).required(),
    });

    return schema.validate(game_console);
}

app.listen(3001, () =>{
    console.log("Server is Running");
});