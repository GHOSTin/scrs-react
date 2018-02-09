import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/factory';
import { Professions } from '../professions/professions';
import { Users } from '../users/users';

export const Students = new Mongo.Collection('students', {
  transform: (student)=>{
    let profession2student = Profession2Student.find(
        {
          studentId: student._id
        },
        { sort: { createAt: -1 }}
    ).fetch();
    profession2student.forEach((profession)=>{
      profession.name = Professions.findOne({_id: profession.profId}).name;
      profession.controller = Users.findOne({_id: profession.controllerId});
      profession.master = Users.findOne({_id: profession.masterId});
      profession.instructor = Users.findOne({_id: profession.instructorId});
    });
    let currentProfession = Profession2Student.findOne(
        {
          studentId: student._id,
          isClosed: false
        },
        { sort: { createAt: -1 }}
    );
    if(currentProfession) {
      student.currentProfession = Professions.findOne({_id: currentProfession.profId});
      student.currentProfession.controller = Users.findOne({_id: currentProfession.controllerId});
      student.currentProfession.master = Users.findOne({_id: currentProfession.masterId});
      student.currentProfession.instructor = Users.findOne({_id: currentProfession.instructorId});
      student.currentProfession.gild = currentProfession.gild;
      student.currentProfession.sector = currentProfession.sector;
    } else {
      student.currentProfession = {
        _id: null,
        gild: "",
        sector: ""
      }
    }
    student.professions = profession2student;
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
    defaultValue: false,
    autoValue: function() {
      if (this.isInsert) {
        return false;
      } else {
        this.unset();
      }
    }
  },
});

Profession2Student.attachSchema(Profession2Student.schema);