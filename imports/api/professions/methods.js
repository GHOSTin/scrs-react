import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import {Professions} from "./professions";

export const insert = new ValidatedMethod({
  name: 'professions.insert',
  validate: new SimpleSchema({
    name: { type: String },
  }).validator(),
  run({ name }) {
    const profession = {
      name
    };
    Professions.insert(profession);
  },
});

export const updateText = new ValidatedMethod({
  name: 'professions.updateText',
  validate: new SimpleSchema({
    id: { type: String },
    name: { type: String },
  }).validator(),
  run({ id, newName }) {
    Professions.update(id, {
      $set: { name: newName },
    });
  },
});

export const remove = new ValidatedMethod({
  name: 'professions.remove',
  validate: new SimpleSchema({
    id: { type: String },
  }).validator(),
  run({ id }) {
    Professions.remove(id);
  },
});


const TODOS_METHODS = _.pluck([
  insert,
  updateText,
  remove,
], 'name');

if (Meteor.isServer) {
  // Only allow 5 todos operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(TODOS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}