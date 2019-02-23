import React from "react";
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import {_} from 'lodash';
import BaseComponent from '../components/BaseComponent.jsx';
import Dialog from 'material-ui/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from 'material-ui/Divider';
import grey from '@material-ui/core/colors/grey';
import cyan from '@material-ui/core/colors/cyan';
const grey50 = grey['50'];
const cyan500 = cyan['500'];
import ActionFace from '@material-ui/icons/Face';
import ArrowDown from '@material-ui/icons/KeyboardArrowDown'
import Avatar from '@material-ui/core/Avatar';
import SuperSelectField from 'material-ui-superselectfield'

import {Row, Col} from 'react-flexbox-grid';

import {insert, update} from '/imports/api/students/methods'
import {displayError} from '../helpers/errors.js';
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";

let DateTimeFormat;

const IntlPolyfill = require('intl');
DateTimeFormat = IntlPolyfill.DateTimeFormat;
require('intl/locale-data/jsonp/ru-RU');

const styles = theme => ({
  dialogStyle: {
    zIndex: 100
  },
  titleStyle: {
    background: grey50
  },
  avatar: {
    boxShadow: "0 0 1px 6px #e8e8e8",
    margin: 10,
    width: 60,
    height: 60,
  },
  dialogTitle: {
    height: 30,
    margin: "15px"
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing.unit,
  },
  cssLabel: {
    '&$cssFocused': {
      color: theme.palette.primary.light,
    },
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: theme.palette.primary.light,
    },
  },
  underlineFocus: {
    borderColor: theme.palette.primary.light
  },
});

class StudentDialog extends BaseComponent {
  baseState = {
    student: {
      name: "",
      speciality: "",
      year: "",
      professions: [],
      currentProfession: {
        _id: null,
        gild: "",
        sector: ""
      }
    },
    verified: true,
  };
  state = this.baseState;

  constructor(props) {
    super(props);
    this.state = {...this.state,
      student: props.student,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      student: props.student,
      ...props.student
    });
  }

  componentWillUnmount(){
    this.setState(this.baseState);
  }

  changeHandlerVal(key, attr, value) {
    let state = {};
    if (key !== null) {
      state[key] = this.state[key] || {};
      if(typeof value === "object"){
        state[key][attr] = {...state[key][attr], value}
      } else {
        state[key][attr] = value;
      }
    } else {
      state[attr] = value;
    }
    state.lastChange = new Date().now; // ms
    this.setState({state});
  };

  changeHandler = (event, key, attr) => {
    if (attr === 'gild' || attr === 'sector'){
      let state = {...this.state.student};
      state[key] = {...state[key], [attr]:event.target.value};
      this.setState({
        student: state
      });
    } else {
      this.changeHandlerVal(key, attr, event.target.value);
    }
  };

  handleSelectionProfession = (values, name) => {
    let state = {...this.state.student};
    state['currentProfession'] = {...state.currentProfession, _id: values?.value, name: values?.label}
    this.setState({
      student: state
    });
  };

  handleSelectionTutor = (values, name) => {
    let state = {...this.state.student};
    let user = (values)?{
      _id: values.value,
      profile: {
        name: values.label
      }
    }:null;
    state['currentProfession'] = {...state.currentProfession, [name]: user};
    this.setState({
      student: state
    });
  };

  handleSave = (e) => {
    e.preventDefault();
    const { professions, _id, ...student } = this.state.student;
    if (this.context.type === "edit" || this.context.type === "attach") {
      update.call({id: _id, student}, displayError);
    } else {
      insert.call({...student, isArchive: false}, displayError);
    }
    this.setState({
      ...this.baseState
    });
    this.props.onHide()
  };

  onHide = (e) => {
    e.preventDefault();
    this.setState({
        ...this.baseState
    });
    this.props.onHide();
  };

  render() {
    const { classes } = this.props;
    const { student } = this.state;

    const error = (student.currentProfession._id && (this.context.type==="attach" || this.context.type==="edit"))?
      [ student.currentProfession.name, student.currentProfession.controller, student.currentProfession.master, student.currentProfession.instructor].filter(v => v).length !== 4 :
      false;

    const actions = [
      <Button
        color={"default"}
        disableFocusRipple={true}
        onClick={this.onHide}
      >Отмена</Button>,
      <Button
        disabled={error}
        color={"primary"}
        disableFocusRipple={true}
        onClick={this.handleSave}
      >Сохранить</Button>,
    ];


    const UserDialogTitle = (<div>
      <Grid container justify="flex-start" alignItems="center">
        <Avatar className={classes.avatar}><ActionFace color={"action"} style={{ fontSize: 48 }} /></Avatar>
      <div className={classes.dialogTitle}>
        {this.context.editing ? "Редактирование студента" : _.isNull(student._id) ? "Новый студент" : "Прикрепление профессии"}
      </div>
      </Grid>
    </div>);

    const dataSourceProfessions = this.context.professions.map(({ _id, name }) => (
        <div key={_id} value={_id} label={name}>
          {name}
        </div>
    ));
    const dataSourceControllers = this.context.controllers.map(({ _id, profile }) => (
        <div key={_id} value={_id} label={profile.name}>
          {profile.name}
        </div>
    ));
    const dataSourceMasters = this.context.masters.map(({ _id, profile }) => (
        <div key={_id} value={_id} label={profile.name}>
          {profile.name}
        </div>
    ));
    const dataSourceInstructors = this.context.instructors.map(({ _id, profile }) => (
        <div key={_id} value={_id} label={profile.name}>
          {profile.name}
        </div>
    ));

    const attachmentInfo = (
    <React.Fragment>
    <h2 className="m-t">Данные о профессии</h2>
    <FormControl required error={error} component="fieldset" className={classes.formControl}>
    <Row>
      <Col xs={12} md={12}>
        <SuperSelectField
          name="currentProfession"
          errorText={error && !student.currentProfession?.name ? "Обязательно к заполнению": ""}
          floatingLabel={"Получаемая профессия"}
          underlineFocusStyle={{ borderColor: this.props.theme.palette.primary.light }}
          autocompleteUnderlineFocusStyle={{ borderColor: this.props.theme.palette.primary.light }}
          floatingLabelFocusStyle={{color: this.props.theme.palette.primary.light}}
          style={{ marginTop: 40, outline: "none" }}
          dropDownIcon={<ArrowDown />}
          showAutocompleteThreshold={'always'}
          hintTextAutocomplete={"Поиск профессии"}
          hintText={""}
          onChange={this.handleSelectionProfession}
          value={student.currentProfession ?
            {
              value: student.currentProfession._id,
              label:student.currentProfession.name
            } : null
        }
        >
          {dataSourceProfessions}
        </SuperSelectField>
        </Col>
        <Col xs={12} md={6}>
          <TextField
            name="gild"
            fullWidth={true}
            label="№ цеха"
            value={student.currentProfession?.gild}
            className={classes.margin}
            InputLabelProps={{
              classes: {
                root: classes.cssLabel,
                focused: classes.cssFocused,
              },
            }}
            InputProps={{
              classes: {
                focused: classes.cssFocused,
                underline: classes.cssUnderline
              },
            }}
            ref={(e) => {
              this.gild = e
            }}
            onChange={(event) => this.changeHandler(event, 'currentProfession', 'gild')}
          />
        </Col>
        <Col xs={12} md={6}>
          <TextField
            name="sector"
            fullWidth={true}
            label="Участок"
            value={student.currentProfession?.sector}
            className={classes.margin}
            InputLabelProps={{
              classes: {
                root: classes.cssLabel,
                focused: classes.cssFocused,
              },
            }}
            InputProps={{
              classes: {
                focused: classes.cssFocused,
                underline: classes.cssUnderline
              },
            }}
            ref={(e) => {
              this.sector = e
            }}
            onChange={(event) => this.changeHandler(event, 'currentProfession', 'sector')}
          />
        </Col>
        <Col xs={12} md={12}>
          <SuperSelectField
            name="controller"
            errorText={error && !student.currentProfession?.controller ? "Обязательно к заполнению": ""}
            floatingLabel={"Наставник"}
            underlineFocusStyle={{ borderColor: this.props.theme.palette.primary.light }}
            autocompleteUnderlineFocusStyle={{ borderColor: this.props.theme.palette.primary.light }}
            floatingLabelFocusStyle={{color: this.props.theme.palette.primary.light}}
            style={{ marginTop: 40, outline: "none" }}
            dropDownIcon={<ArrowDown />}
            showAutocompleteThreshold={'always'}
            hintTextAutocomplete={"Поиск"}
            hintText={""}
            value={student.currentProfession?.controller ?
              {
                value: student.currentProfession.controller._id,
                label:student.currentProfession.controller.profile.name
              } : null
            }
            onChange={this.handleSelectionTutor}
          >
            {dataSourceControllers}
          </SuperSelectField>
        </Col>
        <Col xs={12} md={12}>
          <SuperSelectField
            name="master"
            errorText={error && !student.currentProfession?.master ? "Обязательно к заполнению": ""}
            floatingLabel={"Мастер"}
            underlineFocusStyle={{ borderColor: this.props.theme.palette.primary.light }}
            autocompleteUnderlineFocusStyle={{ borderColor: this.props.theme.palette.primary.light }}
            floatingLabelFocusStyle={{color: this.props.theme.palette.primary.light}}
            style={{ marginTop: 40, outline: "none" }}
            dropDownIcon={<ArrowDown />}
            showAutocompleteThreshold={'always'}
            hintTextAutocomplete={"Поиск"}
            hintText={""}
            value={student.currentProfession?.master ?
              {
                value: student.currentProfession.master._id,
                label:student.currentProfession.master.profile.name
              } : null
            }
            onChange={this.handleSelectionTutor}
          >
            {dataSourceMasters}
          </SuperSelectField>
        </Col>
        <Col xs={12} md={12}>
          <SuperSelectField
            name="instructor"
            errorText={error && !student.currentProfession?.instructor ? "Обязательно к заполнению": ""}
            floatingLabel={"Инструктор"}
            underlineFocusStyle={{ borderColor: this.props.theme.palette.primary.light }}
            autocompleteUnderlineFocusStyle={{ borderColor: this.props.theme.palette.primary.light }}
            floatingLabelFocusStyle={{color: this.props.theme.palette.primary.light}}
            style={{ marginTop: 40, outline: "none" }}
            dropDownIcon={<ArrowDown />}
            showAutocompleteThreshold={'always'}
            hintTextAutocomplete={"Поиск"}
            hintText={""}
            value={student.currentProfession?.instructor ?
              {
                value: student.currentProfession.instructor._id,
                label:student.currentProfession.instructor.profile.name
              } : null
            }
            onChange={this.handleSelectionTutor}
          >
            {dataSourceInstructors}
          </SuperSelectField>
        </Col>
        <Divider/>
      </Row>
    </FormControl>
    </React.Fragment>);

    const generalInfo = (
    <div>
      <h2 className="m-t">Общая информация</h2>
      <Row>
        <Col xs={12} md={12}>
          <TextField
            name="name"
            fullWidth={true}
            label="ФИО"
            value={student.name}
            className={classes.margin}
            InputLabelProps={{
              classes: {
                root: classes.cssLabel,
                focused: classes.cssFocused,
              },
            }}
            InputProps={{
              classes: {
                focused: classes.cssFocused,
                underline: classes.cssUnderline
              },
            }}
            ref={(e) => {
              this.name = e
            }}
            onChange={(event) => this.changeHandler(event,'student', 'name')}
          />
          <TextField
            name="speciality"
            fullWidth={true}
            label="Специальность"
            value={student.speciality}
            className={classes.margin}
            InputLabelProps={{
              classes: {
                root: classes.cssLabel,
                focused: classes.cssFocused,
              },
            }}
            InputProps={{
              classes: {
                focused: classes.cssFocused,
                underline: classes.cssUnderline
              },
            }}
            ref={(e) => {
              this.speciality = e
            }}
            onChange={(event) => this.changeHandler(event,'student', 'speciality')}
          />
          <TextField
            name="year"
            fullWidth={true}
            label="Год выпуска"
            value={student.year}
            className={classes.margin}
            InputLabelProps={{
              classes: {
                root: classes.cssLabel,
                focused: classes.cssFocused,
              },
            }}
            InputProps={{
              classes: {
                focused: classes.cssFocused,
                underline: classes.cssUnderline
              },
            }}
            ref={(e) => {
              this.year = e
            }}
            onChange={(event) => this.changeHandler(event,'student', 'year')}
          />
        </Col>
        <Divider/>
      </Row>
    </div>);

    return (
      <Dialog
        title={
          UserDialogTitle
        }
        titleStyle={styles.titleStyle}
        actions={actions}
        modal={true}
        open={this.props.open}
        onRequestClose={this.props.onHide}
        autoScrollBodyContent={true}
      >
        {(this.context.type === "create" || this.context.type === "edit") ? generalInfo : null}
        {(this.context.type === "attach") ||
        (this.context.type === "edit" && !_.isNull(student.currentProfession?._id)) ? attachmentInfo : null}
      </Dialog>
    )
  }
}

StudentDialog.defaultProps = {
  student: {
    _id: null,
    name: "",
    speciality: "",
    year: "",
    professions: [],
    currentProfession: {
      _id: null,
      gild: "",
      sector: ""
    }
  },
};

StudentDialog.contextTypes  = {
  editing: PropTypes.bool,
  type: PropTypes.string,
  professions: PropTypes.array,
  controllers: PropTypes.array,
  masters: PropTypes.array,
  instructors: PropTypes.array,
};

export default withStyles(styles)(withTheme()(StudentDialog));