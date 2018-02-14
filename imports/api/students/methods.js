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
    "student.currentProfession": {type: Object, blackbox: true, optional: true}
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
    "student.currentProfession.controller": {type: TutorSchema, optional: true, blackbox: true},
    "student.currentProfession.master": {type: TutorSchema, optional: true, blackbox: true},
    "student.currentProfession.instructor": {type: TutorSchema, optional: true, blackbox: true},
  }).validator(),
  run: function ({id, student}) {
    let {currentProfession, ...studentData} = student;
    if(currentProfession && currentProfession._id !== null){
      Profession2Student.update({studentId: id, profId: currentProfession._id, isClosed: false},
        {$set: {
            studentId: id,
            profId: currentProfession._id,
            gild: currentProfession.gild,
            sector: currentProfession.sector,
            controllerId: currentProfession.controller._id,
            masterId: currentProfession.master._id,
            instructorId: currentProfession.instructor._id,
            isClosed: false
          }
        }, {upsert: true});
    }
    Students.update(id, {$set: {...studentData}});
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

export const imports = new ValidatedMethod({
  name: 'students.import',
  validate: null,
  run(data){
    data = _.map(data, function(value){
      return _.object(['name', 'speciality', 'year'], value);
    });
    data.forEach((student)=>{
      let exists = Students.findOne({name: student.name, year: student.year});
      if(!exists) {
        insert.call({student});
      } else {
        if(Meteor.isClient){
          console.error(`Отклонено. Студент "${student.name}" уже добавлен`);
        }
      }
    });
  }
});