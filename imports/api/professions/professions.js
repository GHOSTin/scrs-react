import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/factory';

export const Professions = new Mongo.Collection('professions');

Professions.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Professions.schema = new SimpleSchema({
  name: { type: String }
});

Professions.attachSchema(Professions.schema);

Factory.define('profession', Professions, {});