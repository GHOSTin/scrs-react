import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Students, Profession2Student } from '../../api/students/students';
import { Professions } from '../../api/professions/professions';
import { Users } from '../../api/users/users';
import StudentsPage from '../pages/StudentsPage';

const StudentsPageContainer = withTracker( () => {
  const studentsHandler = Meteor.subscribe('students.list');
  const professionHandler = Meteor.subscribe('professions');
  const usersHandler = Meteor.subscribe('users.list');
  const profession2studentHandler = Meteor.subscribe('students.professions.list');
  const loading = !studentsHandler.ready() || !professionHandler.ready() || !profession2studentHandler.ready();
  const students = Students.find({isArchive: {$not: {$eq:true}}});
  const studentsArchive = Students.find({isArchive: true}, {sort: { year: -1 }});
  const professions = Professions.find({});
  const users = Users.find({});
  const controllers = Roles.getUsersInRole('controller').fetch();
  const masters = Roles.getUsersInRole('master').fetch();
  const instructors = Roles.getUsersInRole('instructor').fetch();
  const professions2student = Profession2Student.find({});
  const listExists = !loading && !!students && !!professions && !!professions2student;
  return {
    user: Meteor.user(),
    loading,
    listExists: true,
    students: listExists ? students.fetch() : [],
    studentsArchive: !loading ? studentsArchive.fetch() : [],
    professions: listExists ? professions.fetch() : [],
    professions2student: listExists ? professions2student.fetch() : [],
    users: listExists ? users.fetch() : [],
    controllers,
    masters,
    instructors
  };
})(StudentsPage);

export default StudentsPageContainer;