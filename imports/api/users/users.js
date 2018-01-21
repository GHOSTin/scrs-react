import { Factory } from 'meteor/factory';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Users = Meteor.users;

Users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Users.publicFields = {
  profile: 1,
};