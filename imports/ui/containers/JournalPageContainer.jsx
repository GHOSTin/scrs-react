import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Students } from '../../api/students/students';
import JournalPage from '../pages/JournalPage';

const JournalPageContainer = withTracker( () => {
  const studentsHandler = Meteor.subscribe('students.masters');
  const studentProfessionHandler = Meteor.subscribe('students.professions.list');
  const professionHandler = Meteor.subscribe('professions');
  const loading = !studentsHandler.ready() || !professionHandler.ready() || !studentProfessionHandler.ready();
  const students = Students.find({});
  const listExists = !loading && !!students;
  console.log(students.fetch());
  return {
    loading,
    listExists: true,
    students: listExists ? students.fetch() : [],
  };
})(JournalPage);

export default JournalPageContainer;