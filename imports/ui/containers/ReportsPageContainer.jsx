import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import ReportsPage from '../pages/ReportsPage';
import {Students} from "../../api/students/students";

const ReportsPageContainer = withTracker( () => {
    const studentsHandler = Meteor.subscribe('students.summary');
    const loading = !studentsHandler.ready();
    const students = Students.find({},{$sort: {"name":1}});
    const listExists = !loading && !!students;
    return {
        loading,
        listExists: listExists,
      students: listExists ? students.fetch(): []
    };
})(ReportsPage);

export default ReportsPageContainer;
