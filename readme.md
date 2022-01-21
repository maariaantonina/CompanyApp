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

## Technologies

Project is created with:

- Express.js
- Mongoose

Tests done with:

- Mocha
- Chai
- Jest

## Setup

To run the server:

### `nodemon server.js` or `yarn start `

Allows connection to DB.

### `yarn test:watch`

Launches the test runner in the interactive watch mode.

## Status

It was my first project with Mongo. Pure fun.
Edit: Needed to use Jest to test Mongoose models logic as well as CRUD operations. Still, there is a bug - after tests my DB is empty. Trying to work it out.
