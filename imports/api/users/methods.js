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
    "doc.email": { type: String, optional: true },
    "doc.password": { type: String },
    "doc.avatar": { type: String, optional: true },
    "doc.role": { type: String },
    "doc.profile": {type: Object},
    "doc.profile.name": {type: String, optional: true},
    "doc.profile.status": {type: String},
  }).validator(),
  run: function ({id, doc}) {
    Meteor.users.update(id, {
      $set: {
        username: doc.username,
        "emails.0.address": doc.email,
        avatar: doc.avatar,
        profile: {
          name: doc.profile.name,
          status: doc.profile.status
        }
      }
    });
    if (doc.password !== "") {
      Accounts.setPassword(id, doc.password)
    }
    Roles.setUserRoles(id, doc.role);
    return true;
  }
});