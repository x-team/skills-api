'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.RESOURCES_TABLE,
    Key: {
      id: event.pathParameters.resourceId,
    },
  };

  dynamoDb.delete(params, (error) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t remove the resource item.'));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify({}),
    };
    callback(null, response);
  });
};
