import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/factory';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import faker from "faker";

export const Journal = new Mongo.Collection('journal');

Journal.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Journal.schema = new SimpleSchema({
  listId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    denyUpdate: true,
  },
  points: {
    type: Array,
    max: 5,
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
});