var express = require('express');
var router = express.Router();
var path = require("path");
var passport = require("passport");
var users = require('../controllers/userCtrl');

var User = require(path.join(appRoot, "server", "models", "user.js"));
var Message = require(path.join(appRoot, "server", "models", "message.js"));
var session;

router.post('/users', function(req, res, next) {
  users.usersReadAll(req, res);
});

router.get('/user/:id', function(req, res, next) {
  users.profile(req, res);
});

router.put('/updateUser/:id', function(req, res, next) {
  users.updateUser(req, res);
});

router.delete('/deleteUser/:id', function(req, res, next) {
  users.deleteUser(req, res);
});

router.post("/api/user/register", function(req, res){
  User.register(new User({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    postalAddress: req.body.postalAddress}), req.body.password, function(err, account) {
      if (err) return res.status(500).json({err: err});

      passport.authenticate('local')(req, res, function(){
        return res.status(200).json({status: "Registration successful!"});
      });
    });
  });

  router.post("/api/user/login", function(req, res, next) {
    passport.authenticate('local', function(err, user, info){
      if (err) return next(err);
      if (!user) return res.status(401).json({err: info});

      req.logIn(user, function(err) {
        if (err) return res.status(500).json({err: "Could not log in user"});
        if(req.body.remember){
          req.session.cookie.maxAge = 60 * 3600;
        }
        else
        {
          req.session.cookie.expires = false;
        }
        res.status(200).json({status: "Login successful!"});
      });
    })(req, res, next);
  });

  router.get('/api/', function(req, res, next) {
    session = req.session;
    //Session set when user request our app via URL
    if(session.email){
      //do sth
      // res.direct('page');
    }
    else {
      // res.render('index.html');
    }
    session = req.body.email;
  })

  router.get('/api/messages', function(req, res) {
    Message.find()
    .populate('user')
    .exec(function(err, messages) {
      (err ? res.send(err) : res.json(messages));
    })
  });

  router.get('/api/messages/from/:id', function(req, res) {
    Message.find({user: req.params.id})
    .populate('user')
    .exec(function(err, messages) {
      (err ? res.send(err) : res.json(messages));
    })
  });

  router.post('/api/messages', function(req, res) {
    User.findOne({username: req.session.passport.user}, function(err, user) {
      Message.create({text: req.body.text, title: req.body.title, user: user._id}, function(err) {
        (err ? res.send(err) : res.status(200).send());
      });
    });
  });

  router.delete('/api/messages/:id', function(req, res) {
    Message.remove({_id: req.params.id}, function(err) {
      (err ? res.send(err) : res.status(200).send());
    });
  });

  router.get('/api/user/logout', function(req, res){
    req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      } else {
        req.logout();
        res.status(200).json({status: "Rest in Peace!"});
      }
    })
  });

  router.get('/api/user/status', function(req, res) {
    if (!req.isAuthenticated()) {
      return res.status(200).json({
        status: false
      });
    }
    res.status(200).json({
      status: true
    });
  });

  router.get('/user/:id', function(req, res, next) {
    users.profile(req, res);
  });

  router.get('/requestfriend/:id', function(req, res, next) {
    console.log('route index.js');
    users.requestfriend(req, res);
  });

  router.get('/listfriends/:id', function(req, res, next) {
    users.listFriends(req, res);
  });
 

    /* GET home page. */
    router.get('*', function(req, res, next) {
      res.status(200).sendFile(path.join(appRoot, "client", "index.html"));
    });
    
  module.exports = router;
