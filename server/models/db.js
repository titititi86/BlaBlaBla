var users = require('./user');
// var ObjectId = mongoose.Schema.Types.ObjectId;
var mongoose = require('mongoose');

exports.find_all_users = function(callback) {
	users.find({},function(err, results) {
		console.log(results);
		callback(results);
	});
};


exports.usersProfile = function(id, callback) {
	var id = mongoose.Types.ObjectId(id);
	users.findOne({_id: id}, function(err, results) {
		console.log('user');
		if (err){
			console.log(err);
			return err;
		}
		else
			callback(results);
	});
};


exports.update = function(id, firstname, lastname, username, email, password, postalAddress, callback) {
	var id = mongoose.Types.ObjectId(id);
	users.update({_id: id}, {firstname: firstname, lastname: lastname, username: username, email: email, password: password, postalAddress: postalAddress}, function(err, results) {

		if (err){
			callback(undefined, err);
		}
		else
			callback(results);
	});
}


exports.delete = function(id, callback) {
	var id = mongoose.Types.ObjectId(id);
	users.remove({_id: id}, function(err, results) {
		if (err){
			console.log(err);
			return err;
		}
		else
			callback(results);
	});
};

