import React from 'react';
import i18n from 'meteor/universe:i18n';
import moment from 'moment';
import BaseComponent from '../components/BaseComponent.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';
import IconButton from 'material-ui/IconButton';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import InfiniteCalendar, {
  Calendar,
  withRange,
} from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';

import {
  insert,
  updateText,
  remove,
} from '/imports/api/professions/methods.js';

export default class JournalPage extends BaseComponent {

  state = {
    message: '',
    open: false,
    selected: null
  };

  constructor(props) {
    super(props);
    this.state = {...this.state, editing: undefined, open: false, value: "" };
  }

  onClickAddedButton = () => {
    insert.call({name: this.state.value}, (error)=>{
      this.setState({
        open: true
      });
      if(error){
        this.setState({
          message: 'Ошибка при добавлении профессии'
        });
        return false;
      }
      this.setState({
        message: 'Добавление прошло успешно.'
      });
      return true;
    });
    this.setState({
      value: "",
    })
  };

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    })
  };

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  };

  onClickRemove = (profession) => {
    remove.call({id: profession._id}, (error)=>{
      this.setState({
        open: true
      });
      if(error){
        this.setState({
          message: 'Ошибка при удалении профессии'
        });
        return false;
      }
      this.setState({
        message: 'Удаление прошло успешно.'
      });
      return true;
    })
  };

  onSelectDate = (selectedDate) => {
    selectedDate = moment(selectedDate.start);
    const startDate = selectedDate.clone().day(1).startOf('day');
    const endDate = selectedDate.clone().day(7).endOf('day');
    console.log(selectedDate.toDate());
    console.log(startDate.toDate());
    console.log(endDate.toDate());
    this.setState({
      selected: {
        start: startDate.toDate(),
        end: endDate.toDate()
      }
    })
  };

  render(){
    const { loading, listExists, professions } = this.props;
    if (!listExists) {
      return <NotFoundPage />;
    }
    let ProfessionsList = <div>
      <InfiniteCalendar
        Component={withRange(Calendar)}
        locale={{
          locale: require('date-fns/locale/ru'),
          headerFormat: 'MMM Do',
          todayLabel: {
            long: 'Сегодня',
          },
          weekdays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
          weekStartsOn: 1,
          blank: "Выберите неделю"
        }}
        selected={this.state.selected}
        onSelect={this.onSelectDate}
      />
    </div>;

    return (
      <div className="page lists-show">
        <div className="content-scrollable list-items">
          {loading
            ? <Message title={i18n.__('pages.ProfessionsPage.loading')} />
            : ProfessionsList}
          <Snackbar
              open={this.state.open}
              message={this.state.message}
              autoHideDuration={4000}
              onRequestClose={this.handleRequestClose}
          />
        </div>
      </div>
    );
  }

}