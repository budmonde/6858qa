// dependencies
const express = require('express');

// models
const Question = require('../models/question');
const Response = require('../models/response');

const router = express.Router();

// api endpoints
router.get('/whoami', function(req, res) {
  res.send({});
  //res.send(req.isAuthenticated() ? req.user : {});
});

router.get('/questions', function(req, res) {
  Question.find({}, function(err, questions) {
    if (err) console.log(err);

    res.send(questions);
  });
});

router.post('/question', function(req, res) {
  //const user = req.isAuthenticated() ? req.user.name : "Anonymous";
  const user = req.body.author ? req.body.author : "Anonymous";
  const newQuestion = new Question({
    'author': user,
    'content': req.body.content,
  });
  newQuestion.save(function(err,question) {
    if (err) console.log(err);

    const io = req.app.get('socketio');
    io.emit('question', question);

    res.send({});
  });
});

router.post('/deletequestion', function(req, res) {
//  if (!req.isAuthenticated()) {
//    // TODO: actually send a client error
//    res.send({
//      deleted: false
//    });
//  } else {
  const _id = req.body._id;
  Question.remove({_id: _id}, function(err) {
    if (err) console.log(err);

    const io = req.app.get('socketio');
    io.emit('deletequestion', _id);

    res.send({
      deleted: true
    });
  });
//  }
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
  //const user = req.isAuthenticated() ? req.user.name : "Anonymous";
  const user = req.body.author ? req.body.author : "Anonymous";
  const newResponse = new Response({
    'author': user,
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

router.post('/deleteresponse', function(req, res) {
//  if (!req.isAuthenticated()) {
//    // TODO: actually send a client error
//    res.send({
//      deleted: false
//    });
//  } else {
  const _id = req.body._id;
  Response.remove({_id: _id}, function(err) {
    if (err) console.log(err);

    const io = req.app.get('socketio');
    io.emit('deleteresponse', _id);

    res.send({
      deleted: true
    });
  });
//  }
});

//router.post('/enqueue', (req, res) => {
//  console.log(req.body);
//});
//
//router.get('/queue', function(req, res) {
//  TAQ.find({}, function(err, queuers) {
//    if (err) console.log(err);
//
//    res.send(queuers);
//  });
//});
//
//router.post('/queue', function(req, res) {
//  const newQueuer = new Queuer({
//    'author': req.body.user,
//    'location': req.body.location,
//  });
//  newQuestion.save(function(err,question) {
//    if (err) console.log(err);
//
//    const io = req.app.get('socketio');
//    io.emit('question', question);
//
//    res.send({});
//  });
//});
//
//router.post('/deletequestion', function(req, res) {
//  if (!req.isAuthenticated()) {
//    // TODO: actually send a client error
//    res.send({
//      deleted: false
//    });
//  } else {
//    const _id = req.body._id;
//    Question.remove({_id: _id}, function(err) {
//      if (err) console.log(err);
//
//      const io = req.app.get('socketio');
//      io.emit('deletequestion', _id);
//
//      res.send({
//        deleted: true
//      });
//    });
//  }
//});

module.exports = router;
