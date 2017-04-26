'use strict';

const uuid = require('uuid');
const slug = require('slug');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.name !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the skill item.'));
    return;
  }

  const params = {
    TableName: process.env.SKILLS_TABLE,
    Item: {
      id: uuid.v1(),
      name: data.name,
      slug: slug(data.name, {lower: true}),
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  dynamoDb.put(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create the skill item.'));
      return;
    }

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Credentials" : true
      },
      body: JSON.stringify(params.Item),
    };

    callback(null, response);
  });
};
