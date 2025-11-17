const express = require("express");
const app = express();
const cors = require('cors');
const multer = require("multer");
const Joi = require("joi")
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

    const consoles = [
        {
            "_id": 1,
            "name": "Sony Playstation 5",
            "price": "499.99",
            "stock": 3, 
            "description": "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback1, adaptive triggers1 and 3D Audio1, and an incredible collection of PlayStation games.",
            "rating": "4.3",
            "img": "console-images/playstation5.jpg"
        },
        {
            "_id": 2,
            "name": "Sony Playstation 4",
            "price": "149.99",
            "stock": 0, 
            "description": "an eighth-generation home video game console by Sony, launched in 2013, that features an AMD-based x86 processor, an integrated GPU, 8 GB of GDDR5 RAM, a Blu-ray disc drive, and a user-friendly interface",
            "rating": "4.6",
            "img": "console-images/playstation-4.png"
        },
        {
            "_id": 3,
            "name": "Sony Playstation Vita",
            "price": "179.99",
            "stock": 0, 
            "description": "a handheld game console developed and marketed by Sony Computer Entertainment",
            "rating": "4.1",
            "img": "console-images/playstation-vita.png"
        },
        {
            "_id": 4,
            "name": "Xbox Series X",
            "price": "649.99",
            "stock": 1, 
            "description": "Microsoft's high-performance, flagship gaming console, designed for next-generation gaming with features like 4K visuals at up to 120 FPS, ray tracing, and extremely fast load times via an SSD",
            "rating": "4.1",
            "img": "console-images/xbox-series-x.png"
        },
        {
            "_id": 5,
            "name": "Xbox One",
            "price": "149.99",
            "stock": 7, 
            "description": "An eighth-generation home video game console developed by Microsoft",
            "rating": "3.8",
            "img": "console-images/xbox-one.png"
        },
        {
            "_id": 6,
            "name": "Xbox 360",
            "price": "89.99",
            "stock": 0, 
            "description": "Microsoft's home video game console, released in 2005 as the successor to the original Xbox",
            "rating": "4.9",
            "img": "console-images/xbox-360.png"
        },
        {
            "_id": 7,
            "name": "Nintendo Switch 2",
            "price": "449.99",
            "stock": 0, 
            "description": "the successor to the original Switch, featuring a larger 1080p screen, the ability to output up to 4K resolution to a TV, and support for HDR and higher frame rates for smoother gameplay",
            "rating": "3.2",
            "img": "console-images/nintendo-switch-2.png"
        },
        {
            "_id": 8,
            "name": "Nintendo Switch",
            "price": "339.99",
            "stock": 9, 
            "description": "a hybrid video game console developed by Nintendo that can be used as both a home console for playing on a TV and a portable handheld device for gaming on the go",
            "rating": "4.7",
            "img": "console-images/nintendo-switch.png"
        }
    ];

app.get("/api/consoles", (req, res) =>{
    res.send(consoles);
});

app.get("/api/consoles/:id", (req, res) =>{
    const game_console = consoles.find((game_console) => game_console._id === parseInt(req.params.id));
    res.send(game_console);
});

app.post("/api/consoles", upload.single("img"), (req, res) =>{
    console.log("in post request");
    const result = validateConsole(req.body);

    if(result.error){
        console.log("ERROR");
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const game_console = {
        _id: consoles.length + 1,
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        description: req.body.description,
        rating: req.body.rating,
    }

    if(req.file){
        game_console.img = "/console-images/" + req.file.filename;
    }

    consoles.push(game_console);
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