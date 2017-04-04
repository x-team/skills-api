'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.vote !== 'number' || typeof data.authorId !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the vote item.'));
    return;
  }

  const params = {
    TableName: process.env.VOTES_TABLE,
    Item: {
      skillId: event.pathParameters.id,
      resourceId: event.pathParameters.resourceId,
      authorId: data.authorId,
      vote: data.vote,
      createdAt: timestamp,
    },
  };

  dynamoDb.put(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create the vote item.'));
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
