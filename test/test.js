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
		blogStack.push(generateEntries());
/*
		blogStack.push({
			author: {
				firstName: faker.name.firstName(),
				lastName: faker.name.lastName()
			},
			title: faker.lorem.word(),
			content: faker.lorem.sentences()
		});
*/
	}
	return BlogPost.insertMany(blogStack);
}

function generateEntries(){
	/*
	const entry = {};
	entry.author = generateAuthor();
	entry.title = generateTitle();
	entry.content = generateContent();
	return entry;
	*/
	/*
	return {
		author: generateAuthor(),
		title: generateTitle(),
		content: generateContent()
	}
	*/
	return {
		author: {
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName()
		},
		title: faker.lorem.word(),
		content: faker.lorem.sentences()
		};
}

function generateAuthor(){
//	const randomName = faker.name.findName();
//	const randomName = faker.fake("{{name.lastName}}, {{name.lastName}}");
//	const randomName = faker.name.findName();
/*
	return {
		"firstName": randomName.firstName,
		"lastName": randomName.lastName
	};
*/
	return {
		"firstName": faker.name.firstName(),
		"lastName": faker.name.lastName()
	};
}
function generateTitle(){
	return faker.lorem.word;
}
function generateContent(){
	return faker.lorem.sentences;
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
/*
		//test db is already established
		//retrieve data from server and compare.
		let res;
//		return chai.require(app)
		return chai.request(app)
		  .get('/posts')
		  .then(_res => {
				res = _res;
//				expect(res).to.be.a('object');
//				expect(res.body).to.include.keys('author', 'title', 'content');
				expect(res).to.be.status(200);
				expect(res.body.length).to.be.at.least(1);
				return BlogPost.count();
			})
		  .then(count => {
//				expect(_count === res.length);
//				expect(res.body).to.have.length.of(count);
				res.body.should.have.length.of(count);
//				expect(res.body.length).to.be.of(count);
//				expect(res.body).to.be.a('object');
		  });
/*
		.then(function(_count){
//			expect(res.body).to.length.of(_count);
		});
*/


			  let res;
			  return chai.request(app)
				.get('/posts')
				.then(_res => {
				  res = _res;
				  res.should.have.status(200);
				  // otherwise our db seeding didn't work
				  res.body.should.have.length.of.at.least(1);

				  return BlogPost.count();
				})
				.then(count => {
				  // the number of returned posts should be same
				  // as number of posts in DB
				  res.body.should.have.length.of(count);
				});
		});
	});
});
















