import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/factory';
import { Professions } from '../professions/professions';
import { Users } from '../users/users';
import { Journal } from '../journal/journal';
import {_} from 'lodash';

export const Students = new Mongo.Collection('students', {
  transform: (student)=>{
    const professions = [];
    let profession2student = Profession2Student.find(
        {
          studentId: student._id,
        },
        { sort: { createAt: 1 }}
    ).fetch();
    profession2student.forEach((profession)=>{
      let item = {};
      item._id = profession.profId;
      item.name = Professions.findOne({_id: profession.profId}).name;
      item.controller = Users.findOne({_id: profession.controllerId});
      item.master = Users.findOne({_id: profession.masterId});
      item.instructor = Users.findOne({_id: profession.instructorId});
      item.gild = profession.gild;
      item.sector = profession.sector;
      item.isClosed = profession.isClosed;
      item.createAt = profession.createAt;
      item.journal = Journal.find(
          {studentId:student._id, profId:profession.profId},
          {fields: {points: 1, startDate: 1, endDate: 1}}).fetch();
      professions.push(item);
    });
    let currentProfession = _.findLast(professions, {isClosed: false});
    if(currentProfession) {
      student.currentProfession = currentProfession;
    } else {
      student.currentProfession = {
        _id: null,
        gild: "",
        sector: ""
      }
    }
    student.professions = professions;
    return student;
  }
});

Students.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Students.schema = new SimpleSchema({
  name: { type: String },
  speciality: { type: String },
  year: { type: String },
  isArchive: {
    type: Boolean,
    autoValue: function(){
      if (this.isInsert && (this.value == null || !this.value.length)) {
        return false;
      }
      if (this.isUpdate && this.isSet && this.operator === '$unset') {
        return { $set: false };
      }
    },
    optional: true
  }
}, {
  clean: {
    filter: true,
    autoConvert: true,
    removeEmptyStrings: true,
    trimStrings: true,
    getAutoValues: true,
    removeNullsFromArrays: true,
  },
});

Students.attachSchema(Students.schema);

Factory.define('student', Students, {});

export const Profession2Student = new Mongo.Collection('profession2student');

Profession2Student.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Profession2Student.schema = new SimpleSchema({
  studentId: { type: String },
  profId: { type: String },
  gild: { type: String },
  sector: { type: String },
  controllerId: { type: String },
  masterId: { type: String },
  instructorId: { type: String },
  createAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  isClosed: {
    type: Boolean,
    defaultValue: false
  },
});

Profession2Student.attachSchema(Profession2Student.schema);