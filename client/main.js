/* global document */

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes.jsx';
//import '/imports/startup/client/load-fonts';

//import 'react-flexbox-grid/dist/react-flexbox-grid.css'

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('app'));
});
