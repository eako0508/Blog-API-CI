'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const faker = require('fake');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');
const {BlogPost} = require('../models');

chai.use(chaiHttp);

//make functions to generate databases

function establishTestDB(){
	const blogStack = [];
	for(let i=0;i<10;i++){
		blogStack.push(generateEntries());
	}
	BlogPost.insertMany(blogStack);
}

function generateEntries(){
	/*
	const entry = {};
	entry.author = generateAuthor();
	entry.title = generateTitle();
	entry.content = generateContent();
	return entry;
	*/
	return {
		author: generateAuthor();
		title: generateTitle();
		content: generateContent();
	}
}

function generateAuthor(){
	const randomName = faker.name.findName();
	return {
		"firstName": randomName.firstName,
		"lastName": randomName.lastName
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
		return runServer();
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

	it('should get data from get', function(){


	});

});