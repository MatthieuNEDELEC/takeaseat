const express = require('express');
const mysql = require('mysql');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

dotenv.config();

var sqlpool = mysql.createPool({
  host: process.env.DBhost,
  port: process.env.DBport,
  user: process.env.DBuser,
  password: process.env.DBpassword,
  database: process.env.DBdatabase
});

router.get('/', (req, res, next) => {
  res.render('home', { page: 'Take A Seat' });
});

router.get('/map', (req, res) => {
  res.render('map', { page: 'Map', layout: 'layout_fw' });
});

router.get('/places', (req, res) => {
  res.render('places', { page: 'Map' });
});

router.get('/newPlace', (req, res, next) => {
  res.render('newplace', { page: 'Add a place' });
});

router.get('/recommendations', (req, res, next) => {
  res.render('recommendations', { page: 'Recommendations' });
});

router.get('/contact', (req, res, next) => {
  res.render('contact', { page: 'Contact us' });
});

router.get('/getplaces', (req, res) => {
  var message = new Object();

  sqlpool.getConnection(function(err, connection) {
    if (err){
      message.err="Oupsi je trouve pas la base de données !! 😱";
      res.send(message);
    }
    else{
      connection.query("SELECT * FROM map", function (err, rows) {
        connection.release();
        if (err) {
          message.err="Oupsi impossible de récupérer les bars !! 😱";
          res.send(message);
        }
        else
          res.send(JSON.stringify(rows));
      });
    }
  });
});

router.get('/getcontact', (req, res) => {
  var message = new Object();

  sqlpool.getConnection(function(err, connection) {
    if (err){
      message.err="La base de données est innaccessible !! 😱";
      res.send(message);
    }     
    else{
      connection.query("SELECT * FROM contact", function (err, rows) {
        connection.release();
        if (err) {
          message.err="La base de données est innaccessible !! 😱";
          res.send(message);
        }
        else
          res.send(JSON.stringify(rows));
      });
    }
  });
});

router.post(
  "/addplace",

  body('nom')
  .not().isEmpty()
  .withMessage("Le nom du bar n'a pas pu être récupéré")
  .isLength({ max: 30 })
  .withMessage('Le nom du bar est trop long')
  .trim().escape(),

  body('lat')
  .not().isEmpty()
  .withMessage("La position du lieu n'a pas pu être récupérée")
  .isFloat()
  .withMessage("La position récupérée n'est pas valide")
  .isLength({ min: 1, max :  20})
  .withMessage("La position récupérée n'est pas valide")
  .trim().escape(),

  body('lon')
  .not().isEmpty()
  .withMessage("La position du lieu n'a pas pu être récupérée")
  .isFloat()
  .withMessage("La position récupérée n'est pas valide")
  .isLength({ min: 1, max :  20})
  .withMessage("La position récupérée n'est pas valide")
  .trim().escape(),

  body('nb_t')
  .not().isEmpty()
  .withMessage("Ajoute le nombre de place de ton établissement !")
  .isInt({ min: 1, max: 500 })
  .withMessage("Le nombre de place entré est invalide")
  .trim().escape(),

  body('rue')
  .if(body('rue').not().isEmpty())
  .isLength({ max: 50 })
  .withMessage('Le nom de la rue est trop long')
  .trim().escape(),

  body('quartier')
  .if(body('quartier').not().isEmpty())
  .isLength({ max: 50 })
  .withMessage('Le nom du quartier est trop long')
  .trim().escape(),

  body('ville')
  .if(body('ville').not().isEmpty())
  .isLength({ max: 50 })
  .withMessage('Le nom de la ville est trop long')
  .trim().escape(),

  body('cp')
  .if(body('cp').not().isEmpty())
  .isInt()
  .withMessage('Le code postal est invalide')
  .isLength({min:5, max: 5 })
  .withMessage('Le code postal est invalide')
  .trim().escape(),

  body('departement')
  .if(body('departement').not().isEmpty())
  .isLength({ max: 50 })
  .withMessage('Le nom du département est trop long')
  .trim().escape(),

  body('region')
  .if(body('region').not().isEmpty())
  .isLength({ max: 50 })
  .withMessage('Le nom de la région est trop long')
  .trim().escape(),

  function(req, res) {
    var message = new Object();
    message.err = null;
    message.success = false;
      
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      message.err = errors.array()[0].msg;
      res.send(message);
    }

    else{

      if(message.err == null){
        
        sqlpool.getConnection(function(err, connection) {
          if (err){
            message.err = "Woops... Impossible de se connecter à la base de données... 😔";
            res.send(message);
          }
          else{
            var sqlquery = "INSERT INTO map (nom, rue, quartier, ville, cp, departement, region, pays, lat, lon, nb_t) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
            connection.query(
              sqlquery,
              [
                req.body.nom,
                req.body.rue,
                req.body.quartier,
                req.body.ville,
                req.body.cp,
                req.body.departement,
                req.body.region,
                req.body.pays,
                req.body.lat,
                req.body.lon,
                req.body.nb_t
              ],
              function (err) {
              connection.release();
              if (err) message.err = "Impossible d'ajouter le bar... N'hésite pas à insulter le webmaster 👍 ^^";
              else message.success = true;
              res.send(message);
            });
          }
        });
      }
      else res.send(message);
    }
});


router.post(
  "/postcom",

  body('nom')
  .not().isEmpty()
  .withMessage('Tu vas bien trouver un petit pseudo ? 😊')
  .isLength({ min: 3 })
  .withMessage('Un petit peu plus long ? 😊')
  .isLength({ max: 20 })
  .withMessage('Désolé si ton nom comporte plus de 20 caractères, peux-tu trouver un diminutif ? 😊')
  .trim().escape(),

  body('msg')
  .not().isEmpty()
  .withMessage('Entre au moins quelque chose 😊')
  .isLength({ min: 10 })
  .withMessage('Détaille un peu plus tes idées 😊')
  .isLength({ max: 500 })
  .withMessage('Tu as l\'air d\'avoir pas mal de choses à dire, et nous t\'en remercions. La limite de chaque message est de 500 caractères, essaye de faire tenir ton message dedans, sinon tu peux faire plsuieurs messages 😊')
  .trim().escape(),

  function(req, res) {

    var message = new Object();
    message.err = null;
    message.success = false;
      
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      message.err = errors.array()[0].msg;
      res.send(message);
    }

    else{
      var nom = null;
      var msg = null;

      try{
        nom = req.body.nom;
        msg = req.body.msg;
      }
      catch{
        message.err = "Les données que vous avez entrées sont invalides";
      }

      if(message.err == null){
        
        sqlpool.getConnection(function(err, connection) {
          if (err){
            message.err = "Impossible d'enregistrer ton message... 😭";
            res.send(message);
          }
          else{
            var sqlquery = "INSERT INTO contact (nom, message) VALUES ('"+nom+"','"+msg+"')";
            connection.query(sqlquery, function (err) {
              connection.release();
              if (err) message.err = err.message+"Impossible d'enregistrer ton message... 😭";
              else message.success = true;
              res.send(message);
            });
          }
        });
      }
      else res.send(message);
    }
});

module.exports = router;
