const express    = require('express');
const path       = require('path');
const config     = require('./config.json');
const bcrypt     = require('bcryptjs');
const bodyParser = require('body-parser');
const fs         = require('fs');
const multer     = require('multer');

const hbs = require('express-handlebars');
const storage = multer.diskStorage({
                    destination: function (req, file, cb) {
                        cb(null, './public/uploads/')
                    },
                    filename : (req, file, cb) => {
                        cb(null, file.originalname);
                    }
                });
const upload = multer({ storage : storage });

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

// app.get("/kek", async (req, res) => {
//     let kek = await bcrypt.hash("lounge", 12);
//     res.send(kek)
// });

app.post("/settings", async (req, res) => {
    let image = [];
    let imagesArray = [];

    fs.readdirSync("./public/img/gallery").forEach(file => {
      image = {
          imgPath: "/img/gallery/" + file
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

app.post("/uploadImages", upload.single("image"), (req, res) => {
    let path    = "./public/uploads/" + req.file.originalname;
    let newPath = "./public/img/gallery/" + req.file.originalname;

    fs.rename(path, newPath, (err) => {
        if (err) throw res.status(500).json({ message : "Ошибка сервера, попробуйте снова" });
    });

    res.status(200).json({ message : "Ok" });
});

app.post("/deleteImage", (req, res) => {
    let path = "./public" + req.body.link;

    fs.unlink(path, (err) => {
        if (err) throw res.status(500).json({ message : "Ошибка сервера, попробуйте снова" });
    });

    res.status(200).json({ message : "Ok" });
});

app.post("/uploadVideo", upload.single("video"), (req, res) => {
    let path    = "./public/uploads/" + req.file.originalname;
    let newPath = "./public/video/video." + req.file.originalname.split('.').pop();

    fs.rename(path, newPath, (err) => {
        if (err) throw res.status(500).json({ message : "Ошибка сервера, попробуйте снова" });
    });

    res.status(200).json({ message : "Ok" });
});

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("*", (req, res) => {
    res.redirect('/');;
});

app.listen(config.ServerPort);
