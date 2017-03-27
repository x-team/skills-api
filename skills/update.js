'use strict';

const slug = require('slug');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  if (typeof data.name !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t update the skill item.'));
    return;
  }

  const params = {
    TableName: process.env.SKILLS_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#skill_name': 'name',
    },
    ExpressionAttributeValues: {
      ':name': data.name,
      ':slug': slug(data.name, {lower: true}),
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #skill_name = :name, slug = :slug, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  dynamoDb.update(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t update the skill item.'));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };

    callback(null, response);
  });
};
