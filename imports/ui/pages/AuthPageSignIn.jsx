import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Users } from '/imports/api/users/users';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';

import AuthPage from './AuthPage.jsx';
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircle from '@material-ui/icons/AccountCircle';
import SecurityTwoTone from '@material-ui/icons/SecurityTwoTone';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {withStyles} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import {Typography} from "@material-ui/core";

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    margin: 0,
  },
});

class SignInPage extends BaseComponent {

  state = {
    showPassword: false,
    errors: {},
    email: null,
    password: null
  };

  onSubmit = (event) => {
    event.preventDefault();
    const email = this.email.value;
    const password = this.password.value;
    const errors = {};

    if (!email) {
      errors.email = i18n.__('Введите логин');
    }
    if (!password) {
      errors.password = i18n.__('Введите пароль');
    }

    this.setState({ errors });
    if (Object.keys(errors).length) {
      return;
    }
    const exists = Users.findOne({username: email});
    if(exists && exists.profile.status === "active") {
        Meteor.loginWithPassword(email, password, (err) => {
            if (err) {
                this.setState({
                    errors: {[err.error]: i18n.__(`pages.authPageSignIn.error-${err.error}`) || err.reason},
                });
            } else {
                this.context.router.push('/');
            }
        });
    } else {
        errors.access = "Доступ запрещен";
        this.setState({ errors });
    }
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  render() {
    const { errors } = this.state;
    const errorMessages = Object.keys(errors).map(key => errors[key]);
    const errorClass = key => errors[key] && 'error';

    const content = (
      <div className={"wrapper-auth"}>
        <Typography variant="h3" gutterBottom className={"title-auth"}>
          {i18n.__('pages.authPageSignIn.signIn')}
        </Typography>
        <Typography variant="subtitle2" className="subtitle-auth">
          {i18n.__('pages.authPageSignIn.signInReason')}
        </Typography>
        <form onSubmit={this.onSubmit} style={{background: '#fff', padding: '0 10px'}}>
          <div className="list-errors">
            {errorMessages.map(msg => (
              <div className="list-item" key={msg}>{msg}</div>
            ))}
          </div>
          <TextField
            label="Имя пользователя"
            placeholder="Имя пользователя"
            fullWidth
            margin="normal"
            variant="outlined"
            inputRef={el => this.email = el}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Пароль"
            placeholder="Пароль"
            fullWidth
            margin="normal"
            variant="outlined"
            type={this.state.showPassword ? 'text' : 'password'}
            inputRef={el => this.password = el}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SecurityTwoTone />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                  >
                    {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <button type="submit" className="btn-primary">
            {"ВХОД"}
          </button>
        </form>
      </div>
    );

    return <AuthPage content={content}/>;
  }
}

SignInPage.contextTypes = {
  router: React.PropTypes.object,
};

export default withStyles(styles)(SignInPage);
