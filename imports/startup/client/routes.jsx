import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import i18n from 'meteor/universe:i18n';

// route components
import AppContainer from '../../ui/containers/AppContainer.jsx';
import UsersPageContainer from '../../ui/containers/UsersPageContainer.jsx';
import ProfessionsPageContainer from '../../ui/containers/ProfessionsPageContainer.jsx';
import StudentsPageContainer from '../../ui/containers/StudentsPageContainer.jsx';
import AuthPageSignIn from '../../ui/pages/AuthPageSignIn.jsx';
import AuthPageJoin from '../../ui/pages/AuthPageJoin.jsx';
import NotFoundPage from '../../ui/pages/NotFoundPage.jsx';
import JournalPageContainer from "../../ui/containers/JournalPageContainer";

i18n.setLocale('ru');

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <Route path="professions" component={ProfessionsPageContainer} />
      <Route path="users" component={UsersPageContainer} />
      <Route path="students" component={StudentsPageContainer} />
      <Route path="journal" component={JournalPageContainer} />
      <Route path="signin" component={AuthPageSignIn} />
      <Route path="join" component={AuthPageJoin} />
      <Route path="*" component={NotFoundPage} />
    </Route>
  </Router>
);
