import React from 'react';
import PropTypes from 'prop-types';
import createClass from 'create-react-class';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Menu from '@material-ui/icons/Menu';
import Avatar from 'material-ui/Avatar';
import LinearProgress from 'material-ui/LinearProgress';
import common from '@material-ui/core/colors/common';
import teal from '@material-ui/core/colors/teal';
import yellow from '@material-ui/core/colors/yellow';
const white = common.white;
const teal500 = teal['500'];
import withWidth, {LARGE, SMALL} from 'material-ui/utils/withWidth';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'; // v1.x
import { MuiThemeProvider as V0MuiThemeProvider} from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Meteor} from 'meteor/meteor';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ConnectionNotification from '../components/ConnectionNotification.jsx';
import MainMenu from '../components/MainMenu';
import UserMenu from '../components/UserMenu';

Object.assign(React, {
  PropTypes,
  createClass
});

const theme = createMuiTheme({
  /* theme for v1.x */
  palette: {
    primary: teal,
    secondary: yellow,
  },
});
const themeV0 = getMuiTheme({
  /* theme for v0.x */
});

const CONNECTION_ISSUE_TIMEOUT = 5000;

const navStyle = {
  marginTop: 64,
  height: (window.innerHeight - 64)
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navDrawerDocker: props.width === LARGE,
      navDrawerOpen: props.width === LARGE,
      showConnectionIssue: false,
      isAuthenticated: Meteor.userId() !== null
    };
    this.logout = this.logout.bind(this);
  }

  componentWillMount() {
    if (!this.state.isAuthenticated) {
      this.context.router.push('/signin');
    }
  }

  componentDidMount() {
    setTimeout(() => {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({showConnectionIssue: true});
    }, CONNECTION_ISSUE_TIMEOUT);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.width !== nextProps.width) {
      this.setState({
        navDrawerDocker: nextProps.width === LARGE,
        navDrawerOpen: nextProps.width === LARGE
      });
    }
    this.setState({
      isAuthenticated: Meteor.userId() !== null
    });
  }

  handleChangeRequestNavDrawer() {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen
    });
  }

  onRequestChange(open, reason) {
    this.setState({
      navDrawerOpen: open
    });
  }

  logout(e) {
    e.preventDefault();
    Meteor.logout((err) => {
      if (err) {
        console.log( err.reason );
      } else {
        this.setState({
          isAuthenticated: false
        });
        this.context.router.push('/signin')
      }
    });
  }

  render() {
    const { showConnectionIssue, navDrawerOpen, isAuthenticated } = this.state;
    const {
      user,
      connected,
      loading,
      children,
      location,
    } = this.props;
    const paddingLeftDrawerOpen = 270;

    // clone route components with keys so that they can
    // have transitions
    const clonedChildren = children && React.cloneElement(children, {
      key: location.pathname,
    });

    const styles = {
      header: {
        paddingLeft: navDrawerOpen ? paddingLeftDrawerOpen : 0
      },
      container: {
        margin: isAuthenticated ? '80px 20px 20px 15px': 'inherit',
        paddingLeft: navDrawerOpen && isAuthenticated  && this.props.width !== SMALL ? paddingLeftDrawerOpen : 0
      },
      navStyle: {
        marginTop: 57,
      },
      menuButton: {
        marginLeft: 10
      },
      appBar: {
        position: 'fixed',
        top: 0,
        overflow: 'hidden',
        maxHeight: 57,
        zIndex: 1400,
        backgroundColor: teal500
      },
      loadingStyle: {
        zIndex: 1500
      },
      avatar: {
        div: {
          padding: '15px 16px 20px 15px',
          backgroundImage:  'url(/material_bg.jpg)',
          backgroundSize: 'cover',
          boxSizing: "content-box",
          backgroundColor: "#edefef"
        },
        icon: {
          display: 'block',
          marginRight: 15,
          boxShadow: '0px 0px 0px 4px rgba(0,0,0,0.2)'
        },
        span: {
          paddingTop: 12,
          display: 'block',
          color: 'white',
          textShadow: '1px 1px #151515',
          textTransform: 'capitalize',
          fontSize: 14,
          fontWeight: 500
        }
      }
    };

    const Logged = (props) => (
      <IconMenu
        {...props}
        iconButtonElement={
          <IconButton><MoreVertIcon color="action" /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText="Выход" onClick={this.logout.bind(this)} />
      </IconMenu>
    );

    return (
      <MuiThemeProvider theme={theme}>
        <V0MuiThemeProvider muiTheme={themeV0}>
          <div>
            {loading ?
                <LinearProgress mode="indeterminate" color={teal500} style={styles.loadingStyle}/> : null}
            <AppBar
                title={"Дневник практик ББМ"}
                style={styles.appBar}
                iconElementLeft={
                  <IconButton
                      style={styles.menuButton}
                      onClick={this.state.isAuthenticated ? this.handleChangeRequestNavDrawer.bind(this) : null}
                  >
                    <Menu/>
                  </IconButton>
                }
                iconElementRight={
                  this.state.isAuthenticated ? <Logged /> : null
                }
            >
              {showConnectionIssue && !connected
                  ? <ConnectionNotification/>
                  : null}
            </AppBar>
            {this.state.isAuthenticated ?
                <Drawer
                    docked={this.state.navDrawerDocker}
                    open={this.state.navDrawerOpen}
                    containerStyle={styles.navStyle}
                    onRequestChange={this.onRequestChange.bind(this)}
                    width={paddingLeftDrawerOpen}
                >
                  {!loading ?
                      <div style={styles.avatar.div}>
                        <Avatar src={user.avatar}
                                size={50}
                                style={styles.avatar.icon}/>
                        <span style={styles.avatar.span}>{user.profile.name}</span>
                      </div> : null
                  }
                  <MainMenu/>
                  {Roles.userIsInRole(user, 'admin')? <UserMenu/>: null}
                </Drawer> : null}
            <div style={styles.container}>
              <ReactCSSTransitionGroup
                  transitionName="fade"
                  transitionEnterTimeout={200}
                  transitionLeaveTimeout={200}
              >
                {!loading ? clonedChildren : null}
              </ReactCSSTransitionGroup>
            </div>
          </div>
        </V0MuiThemeProvider>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  user: React.PropTypes.object,      // current meteor user
  connected: React.PropTypes.bool,   // server connection status
  loading: React.PropTypes.bool,     // subscription status
  children: React.PropTypes.element, // matched child route component
  location: React.PropTypes.object,  // current router location
  params: React.PropTypes.object,    // parameters of the current route
};

App.contextTypes = {
  router: React.PropTypes.object,
};

export default withWidth()(App);
