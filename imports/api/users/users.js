import { Factory } from 'meteor/factory';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import faker from "faker";

export const Users = Meteor.users;

Users.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

Users.publicFields = {
  "profile.name": 1,
  "profile.status": 1,
  "avatar": 1,
  "roles": 1,
  "username": 1,
};

Factory.define('user', Users, {
  username: () => `test${faker.random.number()}`,
  profile: { name: () => `test${faker.random.number()}`, status: "active"},
  createdAt: () => new Date(),
});