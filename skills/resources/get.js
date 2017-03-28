'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.RESOURCES_TABLE,
    KeyConditionExpression: 'skillId = :skillId',
    ExpressionAttributeValues: {
      ':skillId': event.pathParameters.id,
    },
  };

  dynamoDb.query(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the resource items.'));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };

    callback(null, response);
  });
};
