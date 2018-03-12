/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { Journal } from '../journal';

Meteor.publish('journal', function() {
  return Journal.find({}, {
    fields: Journal.publicFields,
  });
});
