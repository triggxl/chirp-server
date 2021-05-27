const { expect } = require('chai'); //assertion library
const supertest = require('supertest'); //test HTTP calls

global.expect = expect;
global.supertest = supertest;