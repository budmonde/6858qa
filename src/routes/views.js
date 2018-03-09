// dependencies
const express = require('express');

const router = express.Router();

// public endpoints
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: 'src/views' });
});

//router.get('/taq', (req, res, next) => {
//  res.sendFile('taq.html', {root: 'src/views'});
//});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
