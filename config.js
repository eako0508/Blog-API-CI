'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://user1:admin12345@ds111598.mlab.com:11598/eako-db';
exports.PORT = process.env.PORT || 8080 || 80;
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/blogapp';
