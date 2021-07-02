const express    = require('express');
const path       = require('path');
const config     = require('./config.json');
const bcrypt     = require('bcryptjs');
const bodyParser = require('body-parser');
const fs         = require('fs');

const hbs = require('express-handlebars');

const app = express();

app.engine("hbs", hbs(
    {
        extname : "hbs"
    }
));
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.get("/admin", (req, res) => {
    res.render("auth");
});

app.get("/kek", async (req, res) => {
    let kek = await bcrypt.hash("lounge", 12);
    res.send(kek)
});

app.post("/settings", async (req, res) => {
    let image = [];
    let imagesArray = [];

    fs.readdirSync("./public/img").forEach(file => {
      image = {
          imgPath: "/img/" + file
      };
      imagesArray.push(image);
    });
    
    res.render("admin", {
        imgArr : imagesArray
    });
});

app.post("/login", async (req, res) => {
    if (req.body.login == config.login) {
        let isMatch = await bcrypt.compare(req.body.password, config.password);
        if (!isMatch) {
            res.status(400).json({ message : "Неверный пароль" });
        }

        res.status(200).json({ message : "Ok" });
    } else res.status(400).json({ message : "Неверный логин" });
});

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("*", (req, res) => {
    res.redirect('/');;
});

app.listen(config.ServerPort);
