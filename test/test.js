var should = require("should");
var assert = require("assert");
var request = require("supertest");
var mongoose = require("mongoose");
var config = require("../server/config/config.js");
var User = require("../server/models/user.js");

describe("User", function(){
    var url = config.url;

    before(function(done){
	mongoose.connect(config.db.mongodb);
	mongoose.connection.on("open", function(handler){
	    User.remove({}, function(err){
		done();
	    });
	});

    });

    after(function(done){
	mongoose.connection.close();
	done();
    });


    it ("should create user", function(done){
	var _user = {
	    username: "cyrix@gmail.com",
	    password: "elpasswordo"};
	
	request(url)
	    .post('/api/user/register')
	    .send(_user)
	    .end(function(err, res){
		if (err) throw err;
		res.status.should.be.equal(200);
		done();
	    });
    });

    it ("should fail creating a duplicate user", function(done){
	var _user = {
	    username: "cyrix@gmail.com",
	    password: "elpasswordo"};
	
	request(url)
	    .post('/api/user/register')
	    .send(_user)
	    .end(function(err, res){
		if (err) throw err;
		res.status.should.be.equal(500);
		done();
	    });
    });

    it ("should succeed in login", function(done){
	var _user = {
	    username: "cyrix@gmail.com",
	    password: "elpasswordo"};

	request(url)
	    .post("/api/user/login")
	    .send(_user)
	    .end(function(err, res){
		if (err) throw err;
		res.status.should.be.equal(200);
		done();
	    });
    });

    it ("should fail in login - bad password", function(done){
	var _user = {
	    username: "cyrix@gmail.com",
	    password: "badpasswordo"};

	request(url)
	    .post("/api/user/login")
	    .send(_user)
	    .end(function(err, res){
		if (err) throw err;
		res.status.should.be.equal(401);
		done();
	    });
    });

    it ("should logout", function(done){
	request(url)
	    .get("/api/user/logout")
	    .end(function(err, res){
		if (err) throw err;
		res.status.should.be.equal(200);
		done();
	    });
    });

});
