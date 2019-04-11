
let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let fs = require('fs');
let auth = require('./auth/auth');
let protection = require('./auth/route-protection').authenticate;
const app = express();
const port = process.env.PORT || 3000;
const knex = require('./databaseConnection').knex;

// let {getFiles, setFiles} = require('./fileUpload');
let multer = require('multer');
let folder = 'files/';
// let upload = multer({dest: folder});

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, folder)
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
});
let upload = multer({storage : storage});


app.listen(port, () => {
  console.log(`App running port ${port}`)
})

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
//   res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.setHeader('Access-Control-Allow-Credentials', false);
//   next();
// });

app.post('/file', upload.single('file'), (req, res) => {
  if(req.file) {
    // let img = fs.readFileSync(req.file.path);
    console.log(req.file);
    console.log("Done : "+req.file.path);
  } else {
    console.log("File not uploaded");
  }

})


app.get('/file', (req, res) => {
  // fs.readdir(folder, (err, files) => {
  //   for (let i = 0; i < files.length; ++i) {
  //     files[i] = "http://localhost:3000/" + files[i];
  //   }
  //   res.send(files);
  // })
  res.download(folder);
});


app.get('/file/:filename', function (req, res) {
  let filename = req.params.filename;
  console.log("Single file: "+folder+filename);
  res.download(folder + filename);
})







app.get('/success', (req, res) => res.status(200).send(`Welcome `));

app.post('/welcomeMessage', function (req, res) {
  res.status(200).send(req.body.message);
});


app.post('/register', auth.registerUser);
app.post('/register/:facebook', auth.registerFacebook);
app.post('/login', auth.loginUser);

app.get('/users', protection, function(req, res) {
  knex.raw("select * from users").then((ded) => {
    res.json(ded[0]);
  })
})

