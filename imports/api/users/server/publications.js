import { Meteor } from 'meteor/meteor';

Meteor.publish('users.list', function (){
  return Meteor.users.find({});
});