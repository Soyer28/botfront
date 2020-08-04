'use strict';

var _require = require('apollo-link'),
    ApolloLink = _require.ApolloLink;

var getLoginToken = require('./getLoginToken');

var meteorAuthLink = new ApolloLink(function (operation, forward) {
  operation.setContext(function () {
    return {
      headers: {
        Authorization: 'Bearer ' + (getLoginToken() || '')
      }
    };
  });

  return forward(operation);
});

module.exports = meteorAuthLink;