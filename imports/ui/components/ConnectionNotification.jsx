import React from 'react';
import i18n from 'meteor/universe:i18n';
import Paper from 'material-ui/Paper';

const T = i18n.createComponent();

const ConnectionNotification = () => (
    <Paper className="notifications" zDepth={4}>
      <div className="notification">
        <span className="icon-sync" />
        <div className="meta">
          <div className="title-notification">
            <T>components.connectionNotification.tryingToConnect</T>
          </div>
          <div className="description">
            <T>components.connectionNotification.connectionIssue</T>
          </div>
        </div>
      </div>
    </Paper>
);

export default ConnectionNotification;
