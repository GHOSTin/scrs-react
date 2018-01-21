import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const update =  new ValidatedMethod({
  name: 'users.update',
  validate: new SimpleSchema({
    "id": { type: String },
    "doc": {type: Object},
    "doc.username": { type: String },
    "doc.email": { type: String },
    "doc.password": { type: String },
    "doc.avatar": { type: String },
  }).validator(),
  run({ id, doc }) {
    Meteor.users.update(id, {
      $set: {
        username: doc.username,
        "emails.0.address": doc.email,
        avatar: doc.avatar
      }
    });
    if(doc.password !== ""){
      Accounts.setPassword(id, doc.password)
    }
    return true;
  }
});