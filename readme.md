# Simple API connected to DB

**Simple API created with Express.js and connected to MongoDB with Mongoose**

## Table of Contents

[General info](#general-info)
[Technologies](#technologies)
[Setup](#setup)
[Status](#status)

## General info

This project is simple API connected to MongoDB.

The DB contains of 3 collections (departments, employees, products) that can be modified using Mongoose models. All the API methods are available in controllers folder.

Secondary goal of this project was to implement unit tests methods such as:

- testing mongoose models validation,
- testing mongoose models instance methods CRUD,
- testing endpoints.

Mongoose models validation is performed with Jest and Mongoose validate middleware. Mongoose registers validation as a pre('save') hook on every schema by default. Thus those kinds of tests have no influence on local DB.

Testing CRUD operations is performed using Jest and mongodb-memory-server package that creates mongo binary in memory. Thus it does not have influence on local DB.

Testing API is performed using Mocha and Chai-http. Before hook does not clear existing DB. After tests mock data is deleted.
The future solution could be creating testing DB and clear it before each test.

## Technologies

Project is created with:

- Express.js
- Mongoose

Tests done with:

- Mocha
- Chai
- Jest
- Mongodb-memory-server
- chai-ttp

## Setup

To run the server:

### `nodemon server.js` or `yarn start `

Allows connection to DB.

### `yarn test:watch`

Launches the test runner in the interactive watch mode.

## Status

It was my first project with Mongo. Pure fun.
Edit: Needed to use Jest to test Mongoose models logic as well as CRUD operations. ~~Still, there is a bug - after tests my DB is empty. Trying to work it out.~~
