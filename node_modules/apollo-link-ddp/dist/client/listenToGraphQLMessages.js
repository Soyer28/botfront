'use strict';

var _require = require('apollo-link'),
    Observable = _require.Observable;

var _require2 = require('../common/defaults'),
    GRAPHQL_SUBSCRIPTION_MESSAGE_TYPE = _require2.GRAPHQL_SUBSCRIPTION_MESSAGE_TYPE;

function filterGraphQLMessages(callback) {
  return function (message) {
    var data = typeof message === 'string' ? JSON.parse(message) : message;

    var type = data.type,
        subscriptionId = data.subId,
        result = data.graphqlData;


    if (type === GRAPHQL_SUBSCRIPTION_MESSAGE_TYPE && subscriptionId && result) {
      callback({
        subscriptionId: subscriptionId,
        result: result
      });
    }
  };
}

function createClientStreamObserver(stream) {
  return new Observable(function (observer) {
    var event = 'message';
    var callback = function callback(message) {
      return observer.next(message);
    };

    if (stream) {
      stream.on(event, callback);
    }
    return function () {
      if (stream && stream.eventCallbacks && stream.eventCallbacks[event]) {
        var index = stream.eventCallbacks[event].indexOf(callback);
        if (index > -1) {
          stream.eventCallbacks[event].splice(index, 1);
        }
      }
    };
  });
}

function createSocketObserver(socket) {
  return new Observable(function (observer) {
    var event = 'message:in';
    var listener = function listener(message) {
      return observer.next(message);
    };

    socket.on(event, listener);

    return function () {
      return socket.off(event, listener);
    };
  });
}

module.exports = {
  createClientStreamObserver: createClientStreamObserver,
  createSocketObserver: createSocketObserver,
  filterGraphQLMessages: filterGraphQLMessages
};