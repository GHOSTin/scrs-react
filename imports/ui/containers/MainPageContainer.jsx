import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Students, Profession2Student } from '../../api/students/students';
import MainPage from '../pages/MainPage';

const MainPageContainer = withTracker( () => {
  const studentsHandler = Meteor.subscribe('students.summary');
  const loading = !studentsHandler.ready();
  const students = Students.find({});
  const professions2student = Profession2Student.find({});
  const listExists = !loading && !!students;
  return {
    loading,
    listExists: true,
    students: listExists ? students.fetch() : [],
    professions2student: listExists ? professions2student.fetch() : [],
  };
})(MainPage);

export default MainPageContainer;