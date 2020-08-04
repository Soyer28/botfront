'use strict';

var _require = require('../common/defaults'),
    DEFAULT_PATH = _require.DEFAULT_PATH;

var getLoginToken = require('./getLoginToken');

function createGraphQLFetcher() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$path = _ref.path,
      path = _ref$path === undefined ? DEFAULT_PATH : _ref$path;

  return function graphQLFetcher(graphQLParams) {
    var headers = {
      Authorization: 'Bearer ' + (getLoginToken() || ''),
      'Content-Type': 'application/json'
    };

    return fetch(window.location.origin + '/' + path, {
      method: 'post',
      headers: headers,
      body: JSON.stringify(graphQLParams)
    }).then(function (response) {
      return response.json();
    });
  };
}

module.exports = createGraphQLFetcher;