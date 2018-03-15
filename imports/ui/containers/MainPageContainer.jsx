import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Students } from '../../api/students/students';
import MainPage from '../pages/MainPage';

const MainPageContainer = withTracker( () => {
  const studentsHandler = Meteor.subscribe('students.summary');
  const loading = !studentsHandler.ready();
  const students = Students.find({});
  const listExists = !loading && !!students;
  return {
    loading,
    listExists: true,
    students: listExists ? students.fetch() : [],
  };
})(MainPage);

export default MainPageContainer;