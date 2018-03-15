import { Meteor } from 'meteor/meteor';
// XXX: Session
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';

import { Lists } from '../../api/lists/lists.js';
import App from '../layouts/App.jsx';

export default withTracker(() => {
  const privateHandle = Meteor.subscribe('users.list');
  return {
    user: Meteor.user(),
    loading: !(privateHandle.ready()),
    connected: Meteor.status().connected,
    menuOpen: Session.get('menuOpen'),
    /*lists: Lists.find({ $or: [
      { userId: { $exists: false } },
      { userId: Meteor.userId() },
    ] }).fetch(),*/
  };
})(App);
