'use strict';

var isSubscriptionDefinition = function isSubscriptionDefinition(_ref) {
  var kind = _ref.kind,
      operation = _ref.operation;
  return kind === 'OperationDefinition' && operation === 'subscription';
};

var isSubscription = function isSubscription(_ref2) {
  var query = _ref2.query;
  return query && query.definitions && query.definitions.some(isSubscriptionDefinition);
};

module.exports = isSubscription;