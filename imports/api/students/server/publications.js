import {Meteor} from 'meteor/meteor';

import {Students, Profession2Student} from '../students';

Meteor.publish('students.list', ()=>{
  return Students.find({});
});

Meteor.publish('students.professions.list', ()=>{
  return Profession2Student.find({isClosed: false});
});

Meteor.publish('students.masters', function(){
  let query = {};
  let students = [];

  if(this.userId) {
    if(Roles.userIsInRole(this.userId, 'master')) {
      students = Profession2Student.find({masterId: this.userId, isClosed: false})
          .fetch()
          .map(function (e) {
            return e.studentId;
          });
    }
    if(Roles.userIsInRole(this.userId, 'controller')){
      students = Profession2Student.find({controllerId: this.userId, isClosed: false})
          .fetch()
          .map(function (e) {
            return e.studentId;
          });
    }
    if(Roles.userIsInRole(this.userId, 'instructor')) {
      students = Profession2Student.find({instructorId: this.userId, isClosed: false})
          .fetch()
          .map(function (e) {
            return e.studentId;
          });
    }
    if(Roles.userIsInRole(this.userId, 'admin')) {
      students = Profession2Student.find({isClosed: false})
          .fetch()
          .map(function (e) {
            return e.studentId;
          });
    }
    if (!_.isEmpty(students)) {
      query = {_id: {$in: students}};
      return Students.find(query);
    }
    return [];
  }
  return [];
});