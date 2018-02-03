import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Accounts } from 'meteor/accounts-base';

/**
 * update a user's permissions
 *
 * @param {Object} targetUserId Id of user to update
 * @param {Array} roles User's new permissions
 */

export const updateRoles = (targetUserId, roles) => {
  const loggedInUser = Meteor.user();

  if (!loggedInUser ||
      !Roles.userIsInRole(loggedInUser,
          ['admin'])) {
    throw new Meteor.Error(403, "Access denied")
  }

  Roles.setUserRoles(targetUserId, roles)
};

export const insert =  new ValidatedMethod({
  name: 'users.insert',
  validate: new SimpleSchema({
    "doc": {type: Object},
    "doc.username": { type: String },
    "doc.password": { type: String },
    "doc.avatar": { type: String, optional: true },
    "doc.role": { type: String },
    "doc.profile": {type: Object},
    "doc.profile.name": {type: String, optional: true},
    "doc.profile.status": {type: String},
  }).validator(),
  run: function ({doc}) {
    if(Meteor.isServer) {
      const id = Accounts.createUser({
        password: doc.password,
        username: doc.username,
        profile: {
          name: doc.profile.name,
          status: doc.profile.status,
        }
      });
      Meteor.users.update(id, {
        $set: {
          avatar: doc.avatar
        }
      });
      updateRoles(id, [doc.role]);
      return {
        _id: id
      };
    }
    return true;
  }
});

export const update =  new ValidatedMethod({
  name: 'users.update',
  validate: new SimpleSchema({
    "id": { type: String },
    "doc": {type: Object},
    "doc.username": { type: String },
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
    updateRoles(id, [doc.role]);
    return true;
  }
});

export const remove =  new ValidatedMethod({
  name: 'users.remove',
  validate: new SimpleSchema({
    "id": {type: String},
  }).validator(),
  run: function ({id}) {
    if(Meteor.isServer) {
      const loggedInUser = Meteor.user();
      if (!loggedInUser ||
          !Roles.userIsInRole(loggedInUser,
              ['admin'])) {
        throw new Meteor.Error(403, "Access denied")
      }
      Roles.setUserRoles(id, []);
      Meteor.users.remove(id);
      return true;
    }
  }
});