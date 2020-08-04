'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('apollo-link'),
    ApolloLink = _require.ApolloLink,
    Observable = _require.Observable,
    split = _require.split;

var isSubscription = require('../common/isSubscription');

var _require2 = require('../common/defaults'),
    DEFAULT_METHOD = _require2.DEFAULT_METHOD,
    DEFAULT_PUBLICATION = _require2.DEFAULT_PUBLICATION,
    DEFAULT_CLIENT_CONTEXT_KEY = _require2.DEFAULT_CLIENT_CONTEXT_KEY,
    DEFAULT_SUBSCRIPTION_ID_KEY = _require2.DEFAULT_SUBSCRIPTION_ID_KEY;

var _require3 = require('./listenToGraphQLMessages'),
    createClientStreamObserver = _require3.createClientStreamObserver,
    createSocketObserver = _require3.createSocketObserver,
    filterGraphQLMessages = _require3.filterGraphQLMessages;

function getDefaultMeteorConnection() {
  try {
    var _require4 = require('meteor/meteor'),
        Meteor = _require4.Meteor;

    return Meteor.connection;
  } catch (err) {
    throw new Error('ddp-apollo: missing connection param');
  }
}

function getClientContext(operation) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_CLIENT_CONTEXT_KEY;

  return operation.getContext && operation.getContext()[key];
}

function callPromise(connection, name, args, options) {
  return new Promise(function (resolve, reject) {
    var promise = connection.apply(name, args, options, function (err, data) {
      err ? reject(err) : resolve(data);
    });
    if (promise && promise.then) {
      resolve(promise);
    }
  });
}

var DDPMethodLink = function (_ApolloLink) {
  _inherits(DDPMethodLink, _ApolloLink);

  function DDPMethodLink() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$connection = _ref.connection,
        connection = _ref$connection === undefined ? getDefaultMeteorConnection() : _ref$connection,
        _ref$method = _ref.method,
        method = _ref$method === undefined ? DEFAULT_METHOD : _ref$method,
        _ref$ddpRetry = _ref.ddpRetry,
        ddpRetry = _ref$ddpRetry === undefined ? true : _ref$ddpRetry,
        clientContextKey = _ref.clientContextKey;

    _classCallCheck(this, DDPMethodLink);

    var _this = _possibleConstructorReturn(this, (DDPMethodLink.__proto__ || Object.getPrototypeOf(DDPMethodLink)).call(this));

    _this.connection = connection;
    _this.method = method;
    _this.clientContextKey = clientContextKey;
    _this.ddpRetry = ddpRetry;
    return _this;
  }

  _createClass(DDPMethodLink, [{
    key: 'request',
    value: function request() {
      var _this2 = this;

      var operation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var clientContext = getClientContext(operation, this.clientContextKey);
      var args = [operation, clientContext];
      var options = { noRetry: !this.ddpRetry };

      return new Observable(function (observer) {
        callPromise(_this2.connection, _this2.method, args, options).then(function (result) {
          return observer.next(result);
        }).catch(function (err) {
          return observer.error(err);
        }).finally(function () {
          return observer.complete();
        });

        return function () {};
      });
    }
  }]);

  return DDPMethodLink;
}(ApolloLink);

var DDPSubscriptionLink = function (_ApolloLink2) {
  _inherits(DDPSubscriptionLink, _ApolloLink2);

  function DDPSubscriptionLink() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$connection = _ref2.connection,
        connection = _ref2$connection === undefined ? getDefaultMeteorConnection() : _ref2$connection,
        _ref2$publication = _ref2.publication,
        publication = _ref2$publication === undefined ? DEFAULT_PUBLICATION : _ref2$publication,
        _ref2$subscriptionIdK = _ref2.subscriptionIdKey,
        subscriptionIdKey = _ref2$subscriptionIdK === undefined ? DEFAULT_SUBSCRIPTION_ID_KEY : _ref2$subscriptionIdK,
        clientContextKey = _ref2.clientContextKey,
        socket = _ref2.socket;

    _classCallCheck(this, DDPSubscriptionLink);

    var _this3 = _possibleConstructorReturn(this, (DDPSubscriptionLink.__proto__ || Object.getPrototypeOf(DDPSubscriptionLink)).call(this));

    _this3.connection = connection;
    _this3.publication = publication;
    _this3.clientContextKey = clientContextKey;
    _this3.subscriptionIdKey = subscriptionIdKey;

    _this3.subscriptionObservers = new Map();
    _this3.ddpObserver = socket ? createSocketObserver(socket) : createClientStreamObserver(_this3.connection._stream);

    _this3.ddpSubscription = _this3.ddpObserver.subscribe({
      next: filterGraphQLMessages(function (_ref3) {
        var subscriptionId = _ref3.subscriptionId,
            result = _ref3.result;

        var observer = _this3.subscriptionObservers.get(subscriptionId);

        if (observer) {
          observer.next(result);
        }
      })
    });
    return _this3;
  }

  _createClass(DDPSubscriptionLink, [{
    key: 'request',
    value: function request() {
      var _this4 = this;

      var operation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var clientContext = getClientContext(operation, this.clientContextKey);
      var subHandler = this.connection.subscribe(this.publication, operation, clientContext);
      var subId = subHandler[this.subscriptionIdKey];

      return new Observable(function (observer) {
        _this4.subscriptionObservers.set(subId, observer);

        return function () {
          if (subHandler.stop) {
            subHandler.stop();
          } else if (_this4.connection.unsubscribe) {
            _this4.connection.unsubscribe(subId);
          } else {
            console.warn('ddp-apollo: could not unsubscribe from subscription with ID ' + subId);
          }
          _this4.subscriptionObservers.delete(subId);
        };
      });
    }
  }]);

  return DDPSubscriptionLink;
}(ApolloLink);

var DDPLink = function (_ApolloLink3) {
  _inherits(DDPLink, _ApolloLink3);

  function DDPLink(options) {
    _classCallCheck(this, DDPLink);

    var _this5 = _possibleConstructorReturn(this, (DDPLink.__proto__ || Object.getPrototypeOf(DDPLink)).call(this));

    _this5.methodLink = new DDPMethodLink(options);
    _this5.subscriptionLink = new DDPSubscriptionLink(options);
    return _this5;
  }

  _createClass(DDPLink, [{
    key: 'request',
    value: function request() {
      var operation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return split(isSubscription, this.subscriptionLink, this.methodLink).request(operation);
    }
  }]);

  return DDPLink;
}(ApolloLink);

function getDDPLink(options) {
  return new DDPLink(options);
}

module.exports = {
  getDDPLink: getDDPLink,
  DDPLink: DDPLink,
  DDPMethodLink: DDPMethodLink,
  DDPSubscriptionLink: DDPSubscriptionLink
};