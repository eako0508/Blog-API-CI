'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;
const should = chai.should();

const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

//make functions to generate databases
function establishTestDB(){
	const blogStack = [];
	for(let i=0;i<10;i++){
		blogStack.push({
			author: {
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName()
			},
			title: faker.lorem.word(),
			content: faker.lorem.sentences()
		});
	}
	return BlogPost.insertMany(blogStack);
}

function tearDown(){
	return mongoose.connection.dropDatabase();
}

describe('Blog', function(){

	before(function(){
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function(){
		return establishTestDB();
	});
	afterEach(function(){
		return tearDown();
	});

	after(function(){
		return closeServer();
	});
	describe('GET endpoint',function(){
		it('should get data from get', function(){
		let res;
		return chai.request(app)
		  .get('/posts')
		  .then(_res => {
				res = _res;
				expect(res).to.be.status(200);
				expect(res.body.length).to.be.at.least(1);
				return BlogPost.count();
			})
		.then(function(count){
			expect(res.body).to.have.length.of(count);
		});

		});
	});
});
















