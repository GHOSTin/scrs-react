import {Meteor} from 'meteor/meteor';

import {Students, Profession2Student} from '../students';
import {Professions} from '../../professions/professions'

import { publishComposite } from 'meteor/reywood:publish-composite';
import {Journal} from "../../journal/journal";

Meteor.publish('students.list', function listsPrivate() {
  if (!this.userId) {
    return this.ready();
  }
  return Students.find({});
});

Meteor.publish('students.professions.list', ()=>{
  return Profession2Student.find({isClosed: false});
});

publishComposite('students.masters', {
  find() {
    let query = {};
    let students = [];

    if (this.userId) {
      if (Roles.userIsInRole(this.userId, 'master')) {
        students = Profession2Student.find({masterId: this.userId, isClosed: false})
          .fetch()
          .map(function (e) {
            return e.studentId;
          });
      }
      if (Roles.userIsInRole(this.userId, 'controller')) {
        students = Profession2Student.find({controllerId: this.userId, isClosed: false})
          .fetch()
          .map(function (e) {
            return e.studentId;
          });
      }
      if (Roles.userIsInRole(this.userId, 'instructor')) {
        students = Profession2Student.find({instructorId: this.userId, isClosed: false})
          .fetch()
          .map(function (e) {
            return e.studentId;
          });
      }
      if (Roles.userIsInRole(this.userId, 'admin')) {
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
  },
  children: [
    {
      find(student){
        return Profession2Student.find({studentId: student._id, isClosed: false})
      },
      children: [
        {
          find(p2s, student) {
            return Professions.find({_id: p2s.profId})
          }
        },
        {
          find(p2s, student) {
            return Journal.find({studentId: student._id, profId: p2s.profId}, {
              fields: Journal.publicFields,
            })
          }
        }
      ]
    }
  ]
});

publishComposite('students.summary', {
  find() {
    let query = {};
    let students = [];

    if (this.userId) {
      if (Roles.userIsInRole(this.userId, 'master')) {
        students = Profession2Student.find({masterId: this.userId})
            .fetch()
            .map(function (e) {
              return e.studentId;
            });
      }
      if (Roles.userIsInRole(this.userId, 'controller')) {
        students = Profession2Student.find({controllerId: this.userId})
            .fetch()
            .map(function (e) {
              return e.studentId;
            });
      }
      if (Roles.userIsInRole(this.userId, 'instructor')) {
        students = Profession2Student.find({instructorId: this.userId})
            .fetch()
            .map(function (e) {
              return e.studentId;
            });
      }
      if (Roles.userIsInRole(this.userId, 'admin')) {
        students = Profession2Student.find({})
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
  },
  children: [
    {
      find(student){
        return Profession2Student.find({studentId: student._id})
      },
      children: [
        {
          find(p2s, student) {
            return Professions.find({_id: p2s.profId})
          }
        },
        {
          find(p2s, student) {
            return Journal.find({studentId: student._id, profId: p2s.profId}, {
              fields: Journal.publicFields,
            })
          }
        }
      ]
    }
  ]
});