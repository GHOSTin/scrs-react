import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/factory';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Journal = new Mongo.Collection('journal');

Journal.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Journal.schema = new SimpleSchema({
  studentId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  profId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  points: {
    type: [String],
    minCount: 5,
    maxCount: 5
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
});

Journal.attachSchema(Journal.schema);

Journal.publicFields = {
  studentId: 1,
  profId: 1,
  points: 1,
  startDate: 1,
  endDate: 1,
};

Factory.define('journal', Journal, {});