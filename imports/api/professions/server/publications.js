import {Meteor} from 'meteor/meteor';

import {Professions} from '../professions';

Meteor.publish('professions', ()=>{
  return Professions.find({});
});