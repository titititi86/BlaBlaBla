var db = require('../models/db');
var user = require('../models/user');
var mongoose = require('mongoose');
var friends = require("mongoose-friends");


exports.usersReadAll = function(req, res) {
  db.find_all_users(function(results)
  {

    console.log('userlist');
    console.log(results);

    res.send(results);
  });
};


exports.profile = function(req, res) {
  console.log('profile');
  console.log(req.params.id);
  db.usersProfile(req.params.id, function (results, err)
  {
    console.log("po");
    (err ? res.send(err) : res.json(results));
  });
};

exports.requestfriend = function(req, callback){
  user.requestFriend(req.params.id, req.user.id, function(res, err){
    if (err){
      console.log(err);
      return err;
    }
    console.log("requestFriend ctrl");
  });
};

exports.listFriends = function(req, res){
  console.log("in list");
  user.getFriends(req.params.id, function(err, friendships){
    err ? res.send(err) : res.json(friendships);
  })
};


exports.updateUser = function(req, res) {
  console.log('updateUser');
  console.log(req.params.id);
  db.update(req.params.id, req.body.user.firstname, req.body.user.lastname, req.body.user.username, req.body.user.email, req.body.user.password, req.body.user.postalAddress, function (results, err)
  {
   console.log("update");
   (err ? res.send(err) : res.json(results));
 });
};   

exports.deleteUser = function(req, res) {
  console.log('deleteUser ctrl');
  console.log(req.params.id);
  db.delete(req.params.id, function (results, err)
  {
   console.log("delete ctrl");
   (err ? res.send(err) : res.json(results));
 });
}
