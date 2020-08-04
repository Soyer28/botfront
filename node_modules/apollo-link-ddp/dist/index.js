'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var defaults = require('./common/defaults');
var isSubscription = require('./common/isSubscription');

var _require = require('./client/apollo-link-ddp'),
    getDDPLink = _require.getDDPLink,
    DDPLink = _require.DDPLink,
    DDPMethodLink = _require.DDPMethodLink,
    DDPSubscriptionLink = _require.DDPSubscriptionLink;

var MeteorLink = require('./client/apollo-link-meteor');
var meteorAuthLink = require('./client/apollo-link-meteor-auth');
var createGraphQLFetcher = require('./client/graphQLFetcher');

module.exports = _extends({}, defaults, {
  isSubscription: isSubscription,
  getDDPLink: getDDPLink,
  DDPLink: DDPLink,
  DDPMethodLink: DDPMethodLink,
  DDPSubscriptionLink: DDPSubscriptionLink,
  MeteorLink: MeteorLink,
  meteorAuthLink: meteorAuthLink,
  createGraphQLFetcher: createGraphQLFetcher
});