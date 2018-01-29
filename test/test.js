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

	describe('GET with id', function(){
		it('should return the same entry', function(){
			let resBlogpost;
			return chai.request(app)
			  .get('/posts')
			  .then(function(res){
				expect(res).to.be.a('object');
				expect(res).to.be.status(200);

				res.body.forEach(function(obj){
					expect(obj).to.be.a('object');
					expect(obj).to.include.keys(
						'title','content','author');
				});

				resBlogpost = res.body[0];
				return BlogPost.findById(resBlogpost.id);
  			  })
			  .then(function(res){
					expect(res.title).to.be.equal(resBlogpost.title);
					expect(res.content).to.be.equal(resBlogpost.content);
					expect(res.authorName).to.be.equal(resBlogpost.author);
			  });
		  });
	});


	describe('POST', function(){
		it('should create entry', function(){
			let newEntry = {
				title: faker.lorem.word(),
				content: faker.lorem.word(),
				author: {
					firstName: faker.name.firstName(),
					lastName: faker.name.lastName()
				}
			};
			return chai.request(app)
			  .post('/posts')
			  .send(newEntry)
			  .then(res=>{
				expect(res).to.be.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				expect(res.body).to.include.keys(
					'title','content','author');
				expect(res.body.id).should.not.be.null;
				expect(res.body.title).to.be.equal(newEntry.title);
				expect(res.body.content).to.be.equal(newEntry.content);
				console.log(res.body.author);
				expect(res.body.author).to.be.equal(
					`${newEntry.author.firstName} ${newEntry.author.lastName}`);
		
				return BlogPost.findById(res.body.id);
			  })
			  .then(resp=>{
				expect(resp.title).to.be.equal(newEntry.title);
				expect(resp.content).to.be.equal(newEntry.content);
				expect(resp.author.firstName).to.be.equal(newEntry.author.firstName);
				expect(resp.author.lastName).to.be.equal(newEntry.author.lastName);
			  });
		});
	});

});
















