import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {Students, Profession2Student} from "./students";

const TutorSchema = new SimpleSchema({
  "_id":{type: String},
  "name": {type: String},
});

export const insert =  new ValidatedMethod({
  name: 'students.insert',
  validate: new SimpleSchema({
    "student": {type: Object},
    "student.name": { type: String },
    "student.speciality": { type: String },
    "student.year": { type: String },
    "student.currentProfession": {type: Object, blackbox: true}
  }).validator(),
  run: function ({student}) {
    if(Meteor.isServer) {
      Students.insert(student);
    }
    return true;
  }
});

export const update =  new ValidatedMethod({
  name: 'students.update',
  validate: new SimpleSchema({
    "id": { type: String },
    "student": {type: Object},
    "student.name": { type: String },
    "student.speciality": { type: String },
    "student.year": { type: String },
    "student.currentProfession": {type: Object, optional: true},
    "student.currentProfession._id": {type: String},
    "student.currentProfession.gild": {type: String},
    "student.currentProfession.sector": {type: String},
    "student.currentProfession.name": {type: String, optional: true},
    "student.currentProfession.controller": {type: TutorSchema, optional: true},
    "student.currentProfession.master": {type: TutorSchema, optional: true},
    "student.currentProfession.instructor": {type: TutorSchema, optional: true},
  }).validator(),
  run: function ({id, doc}) {
    let {currentProfession, ...student} = doc;
    if(currentProfession._id !== null){
      Profession2Student.update({studentId: id, profId: currentProfession._id, isClosed: false},
        {$set: {
            studentId: id,
            profId: currentProfession._id,
            gild: currentProfession.gild,
            sector: currentProfession.sector,
            controllerId: currentProfession.controller._id,
            masterId: currentProfession.master._id,
            instructorId: currentProfession.instructor._id,
          }
        }, {upsert: true});
    }
    Students.update(id, student);
    return true;
  }
});

export const remove =  new ValidatedMethod({
  name: 'students.remove',
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
      Students.remove(id);
      return true;
    }
  }
});