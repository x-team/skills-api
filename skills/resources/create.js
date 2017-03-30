'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.type !== 'string' ||
    typeof data.url !== 'string' ||
    typeof data.description !== 'string' ||
    typeof data.authorId !== 'string'
  ) {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the resource item.'));
    return;
  }

  const params = {
    TableName: process.env.RESOURCES_TABLE,
    Item: {
      id: uuid.v1(),
      skillId: event.pathParameters.id,
      url: data.url,
      type: data.type,
      description: data.description,
      authorId: data.authorId,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  dynamoDb.put(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create the resource item.'));
      return;
    }

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Credentials" : true
      },
      body: JSON.stringify(result.Item),
    };

    callback(null, response);
  });
};
