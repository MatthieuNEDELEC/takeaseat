const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('accueil', { page: 'Take A Seat' });
});

router.get('/map', (req, res, next) => {
  res.render('map', { page: 'Map' });
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

module.exports = router;
