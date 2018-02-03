import { Meteor } from 'meteor/meteor';
import { Users } from '../users';

Meteor.publish('users.list', function (){
  return Meteor.users.find({}, {fields: Users.publicFields});
});

Meteor.publish(null, function (){
  return Meteor.users.find(this.userId, {fields: Users.publicFields});
});