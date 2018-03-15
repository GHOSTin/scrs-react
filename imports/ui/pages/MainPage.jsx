import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';

import {Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import {Card, CardHeader, CardText } from 'material-ui/Card';
import {Divider, Paper} from "material-ui";
import {Profession2Student} from "../../api/students/students";
import {Professions} from "../../api/professions/professions";

export default class ListPage extends BaseComponent {
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

  currentProfession = (student) => {
    let p2s = Profession2Student.findOne({studentId: student, isClosed: false});
    if(p2s){
      let profession = Professions.findOne({_id: p2s.profId});
      return profession.name;
    } else {
      return "Отсутствует";
    }
  };

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
          <Card key={student._id}>
            <CardHeader
                title={
                  <Table selectable={false}  >
                    <TableBody displayRowCheckbox={false}>
                      <TableRow>
                        <TableRowColumn>
                          {student.name}
                        </TableRowColumn>
                        <TableRowColumn>
                          {student.speciality}
                        </TableRowColumn>
                        <TableRowColumn>
                          {student.year}
                        </TableRowColumn>
                        <TableRowColumn style={{width: 250}}>
                          {this.currentProfession(student._id)}
                        </TableRowColumn>
                        <TableRowColumn style={{width: 60}}>
                          Актуальность
                        </TableRowColumn>
                      </TableRow>
                    </TableBody>
                  </Table>
                }
                actAsExpander={true}
                showExpandableButton={true}
                style={{padding: "1px 0"}}
            />
            <CardText expandable={true}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
              Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
              Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
            </CardText>
          </Card>
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

ListPage.propTypes = {
  loading: React.PropTypes.bool,
  listExists: React.PropTypes.bool,
  students: React.PropTypes.array
};
