import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';
import ResultItem from '../components/ResultItem.jsx';

import {Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import {Card, CardHeader, CardText } from 'material-ui/Card';
import {Divider, Paper} from "material-ui";
import {Profession2Student} from "../../api/students/students";
import {Professions} from "../../api/professions/professions";

export default class MainPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { editingTodo: null });
    this.onEditingChange = this.onEditingChange.bind(this);
  }

  onEditingChange(id, editing) {
    this.setState({
      editingTodo: editing ? id : null,
    });
  }


  render() {
    const { students, listExists, loading } = this.props;
    const { editingTodo } = this.state;

    if (!listExists) {
      return <NotFoundPage />;
    }

    let Todos;
    if (!students || !students.length) {
      Todos = (
        <Message
          title={i18n.__('pages.listPage.noTasks')}
          subtitle={i18n.__('pages.listPage.addAbove')}
        />
      );
    } else {
      Todos = (
        <Paper zDepth={1}>
        {students.map((student) => (
          <ResultItem student={student} key={student._id}/>
        ))}
        </Paper>
      );
    }

    return (
      <div className="page lists-show">
        <div className="content-scrollable list-items">
          {loading
            ? <Message title={i18n.__('pages.listPage.loading')} />
            : Todos}
        </div>
      </div>
    );
  }
}

MainPage.propTypes = {
  loading: React.PropTypes.bool,
  listExists: React.PropTypes.bool,
  students: React.PropTypes.array
};
