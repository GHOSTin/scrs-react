import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Users } from '../../api/users/users';
import UsersPage from '../pages/UsersPage';

const UsersPageContainer = withTracker( () => {
  const usersHandler = Meteor.subscribe('users.list');
  const loading = !usersHandler.ready();
  const users = Users.find({});
  const listExists = !loading && !!users;
  return {
    loading,
    listExists: true,
    users: listExists ? users.fetch() : [],
  };
})(UsersPage);

export default UsersPageContainer;