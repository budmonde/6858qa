// dependencies
const express = require('express');

// models
const Question = require('../models/question');
const Response = require('../models/response');

const router = express.Router();

// api endpoints
router.get('/questions', function(req, res) {
  Question.find({}, function(err, questions) {
    if (err) console.log(err);

    res.send(questions);
  });
});

router.post('/question', function(req, res) {
  const newQuestion = new Question({
    'author': req.body.author,
    'content': req.body.content,
  });
  newQuestion.save(function(err,question) {
    if (err) console.log(err);

    const io = req.app.get('socketio');
    io.emit('question', question);

    res.send({});
  });
});

router.get('/response', function(req, res) {
  Response.find({
    parent: req.query.parent
  }, function(err, responses) {
    if (err) console.log(err);

    res.send(responses);
  })
});

router.post('/response', function(req, res) {
  const newResponse = new Response({
    'author': req.body.author,
    'parent': req.body.parent,
    'content': req.body.content,
  });

  newResponse.save(function(err, response) {
    if (err) console.log(err);

    const io = req.app.get('socketio');
    io.emit('response', response);

    res.send({});
  });

});

module.exports = router;
