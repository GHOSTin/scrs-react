import {Meteor} from 'meteor/meteor';

import {Students, Profession2Student} from '../students';

Meteor.publish('students.list', ()=>{
  return Students.find({});
});

Meteor.publish('students.professions.list', ()=>{
  return Profession2Student.find({isClosed: false});
});