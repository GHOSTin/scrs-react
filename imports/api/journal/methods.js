import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {Journal} from "../journal/journal";
import {Profession2Student} from "../students/students";

export const insert =  new ValidatedMethod({
  name: 'journal.insert',
  validate: new SimpleSchema({
    "start": {type: Date},
    "end": { type: Date },
    "data": { type: [Object] },
    "data.$.studentId": { type: String, regEx: SimpleSchema.RegEx.Id },
    "data.$.points": {type: [String], minCount:5, maxCount: 5}
  }).validator(),
  run: function ({start, end, data}) {
    let results = [];
    data.forEach(item => {
      let {studentId, points} = item,
          profId = Profession2Student.findOne({studentId, isClosed: false}).profId;
      let journal = Journal.insert({
        studentId,
        profId,
        points,
        startDate: start,
        endDate: end
      });
      results.push(journal);
    });
    return results;
  }
});