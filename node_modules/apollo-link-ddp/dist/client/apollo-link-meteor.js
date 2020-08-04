'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('apollo-link'),
    ApolloLink = _require.ApolloLink,
    split = _require.split;

var isSubscription = require('../common/isSubscription');

var _require2 = require('./apollo-link-ddp'),
    DDPSubscriptionLink = _require2.DDPSubscriptionLink;

var _require3 = require('../common/defaults'),
    DEFAULT_PATH = _require3.DEFAULT_PATH;

var meteorAuthLink = require('./apollo-link-meteor-auth');

var MeteorLink = function (_ApolloLink) {
  _inherits(MeteorLink, _ApolloLink);

  function MeteorLink() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MeteorLink);

    var _this = _possibleConstructorReturn(this, (MeteorLink.__proto__ || Object.getPrototypeOf(MeteorLink)).call(this));

    var _require4 = require('apollo-link-http'),
        HttpLink = _require4.HttpLink;

    var _options$uri = options.uri,
        uri = _options$uri === undefined ? Meteor.absoluteUrl(DEFAULT_PATH) : _options$uri,
        httpLink = options.httpLink,
        _options$authLink = options.authLink,
        authLink = _options$authLink === undefined ? meteorAuthLink : _options$authLink;


    _this.meteorHttpLink = authLink.concat(httpLink || new HttpLink({ uri: uri }));
    _this.subscriptionLink = new DDPSubscriptionLink(options);
    return _this;
  }

  _createClass(MeteorLink, [{
    key: 'request',
    value: function request() {
      var operation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return split(isSubscription, this.subscriptionLink, this.meteorHttpLink).request(operation);
    }
  }]);

  return MeteorLink;
}(ApolloLink);

module.exports = MeteorLink;