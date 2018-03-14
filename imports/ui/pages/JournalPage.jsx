import React from 'react';
import i18n from 'meteor/universe:i18n';
import moment from 'moment';
import update from 'react-addons-update';
import {_} from 'lodash';
import {Journal} from "../../api/journal/journal";
import BaseComponent from '../components/BaseComponent.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';
import FlatButton from 'material-ui/FlatButton';
import ContentRemove from 'material-ui/svg-icons/content/block';
import {Table, TableHeader, TableBody, TableRow, TableHeaderColumn, TableRowColumn} from 'material-ui/Table';
import Dialog from "material-ui/Dialog";
import RaisedButton from 'material-ui/RaisedButton';
import {teal500, teal400, teal300, fullWhite} from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';
import {Row, Col} from 'react-flexbox-grid';
import InfiniteCalendar, {
  Calendar,
  withRange,
} from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';

import NumberField from '../components/NumberField.jsx';
import serialize from 'form-serialize';

import {insert, close} from "../../api/journal/methods";

const theme={
  selectionColor: teal300,
      textColor: {
  default: '#333',
        active: '#FFF'
  },
  weekdayColor: teal300,
      headerColor: teal400,
      floatingNav: {
    background: teal500,
        color: '#FFF',
        chevron: '#FFA726'
  },
  accentColor: teal400
};

const styles = {
  tableStyles: {
    width: "800px",
  },
  tableWrapperStyle: {
    width: "800px",
  },
  tableHeader: {
    whiteSpace: "normal"
  },
  closeButton: {
    minWidth: "60px"
  },
  dialogStyle: {
    width: 300
  }
};

const Tooltip1 = (
    <ul>
      <li>нарушений / замечаний не было	- 5</li>
      <li>1 нарушение / замечание	- 4</li>
      <li>2 нарушение / замечание	- 3</li>
      <li>3 нарушение / замечание	- 2</li>
      <li>4 нарушения / замечания	- 1</li>
      <li>5 и более  нарушений / замечаний - 0</li>
    </ul>
);

const Tooltip2 = (
    <table className="tooltipTable">
      <tbody>
      <tr>
        <td>Отлично знает ценности и философию компании.<br/>
          Пропагандирует идеалы Белой металлургии.<br/>
          Выявляет потери и инициирует улучшения. Подает рацпредложения</td>
        <td>5</td>
      </tr>
      <tr>
        <td>Знает ценности компании. При работе соблюдает чистоту и порядок.<br/>
          Знает и понимает систему 5С и кайдзен.<br/>
          Легко оперирует понятиями. Способен находить потери и проблемы на производстве.</td>
        <td>4</td>
      </tr>
      <tr>
        <td>Знает ценности компании. При работе соблюдает чистоту и порядок.<br/>
          Имеет представление о системе 5С и кайдзен.</td>
        <td>3</td>
      </tr>
      <tr>
        <td>Знает о наличии ценностей  компании. При работе соблюдает чистоту и порядок.</td>
        <td>2</td>
      </tr>
      <tr>
        <td>Не знает ценности компании. Равнодушен к порядку на рабочем месте.</td>
        <td>1</td>
      </tr>
      <tr>
        <td>Отвергает и высмеивает корпоративную философию компании.</td>
        <td>0</td>
      </tr>
      </tbody>
    </table>
);

const Tooltip3 = (
    <div>
      Проявленные компетенции (оцените по 5 –бальной шкале):
      <ul>
        <li>ориентация на результат</li>
        <li>аналитическое и стратегическое мышление</li>
        <li>принятие решений</li>
        <li>лидерство</li>
        <li>работа в команде</li>
        <li>коммуникация</li>
      </ul>
      <strong>Средний балл оценки Soft-Skills</strong>
    </div>
);

export default class JournalPage extends BaseComponent {

  state = {
    message: '',
    open: false,
    openDialog: false,
    selected: null,
    students: [],
    selectedStudent: null
  };

  constructor(props) {
    super(props);
    this.state = {...this.state, students: props.students};
    this.points = {};
  }

  componentWillReceiveProps(props){
    this.setState({
      students: props.students
    })
  }

  onClickAddedButton = (e) => {
    e.preventDefault();
    if(this.state.selected === null){
      this.setState({
        open: true,
        message: i18n.__('pages.JournalPage.selectWeek')
      });
      return false;
    }
    let error = false, data = [];
    let obj = serialize(this.form, { hash: true });
    for(let key in obj.points){
      let points = obj.points[key];
      if(points.length < 5) {
        this.setState({
          open: true,
          message: i18n.__('pages.JournalPage.pointsCountError')
        });
        error = true;
        break;
      } else {
        data.push({studentId: key, points});
      }
    }
    if(error) return false;
    insert.call({...this.state.selected, data}, (err, res) => {
      if (err) {
        handleError(err.error);
        this.setState({
          message: err.error,
          open: true
        });
      }
      for (const item of res) {
        let journal = Journal.findOne({_id: item});
        let student = journal.studentId;
        let index = _.findIndex(this.state.students, (item) => (item._id === student));
        this.setState({
          students: update(this.state.students, {[index]: {currentProfession: {journal: {$push: [{
                      ...journal
                  }]}}}})
        })
      }
    });
    _.forEach(this.points, (e)=>{
      if (e) {
        e.setState({value: ""});
      }
    });
    this.setState({
      selected: null,
      message: "Запись прошла успешно",
      open: true
    });
  };

  handleClose = () => {
    this.setState({
      openDialog: false,
      selectedStudent: null
    })
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  handleRequestCloseProfession = (student) => {
    this.setState({
      openDialog: true,
      selectedStudent: student
    });
  };

  onClickRemove = () => {
    close.call(
      {studentId: this.state.selectedStudent._id, profId: this.state.selectedStudent.currentProfession._id},
      (err, res)=>{
        this.setState({
          openDialog: false,
          open: true,
          selectedStudent: null
        });
        if(err){
          this.setState({
            message: 'Ошибка при откреплении студента.'
          });
          return false;
        }
        _.remove(this.state.students, (item) => (item._id === res));
        this.setState({
          message: 'Открепление прошло успешно.'
        });
        return true;
      });
  };

  onSelectDate = (selectedDate) => {
    selectedDate = moment(selectedDate.start);
    const startDate = selectedDate.clone().day(1).startOf('day');
    const endDate = selectedDate.clone().day(7).endOf('day');
    this.setState({
      selected: {
        start: startDate.toDate(),
        end: endDate.toDate()
      }
    });

  };

  render(){
    const { loading, listExists } = this.props;
    const { students } = this.state;
    console.log(students);
    let filteredStudents = students.filter(
        student => {
          let count = this.state.selected ?
              _.filter(student.currentProfession.journal,  journal=>{
                return moment(journal.startDate).isSame(moment(this.state.selected.start))
              }) :
              [];
          return count.length === 0 || student.currentProfession.journal.length >= 12;
        }
    );
    if (!listExists || !Meteor.userId()) {
      return <NotFoundPage />;
    }

    const actions = [
      <FlatButton
          label="Отмена"
          onClick={this.handleClose}
      />,
      <FlatButton
          label="Окончить"
          primary={true}
          onClick={this.onClickRemove}
      />,
    ];

    const TableHeaderData = [
      {
        name: "Выполнение сменных заданий",
        tooltip: "Средняя оценка из недельного плана"
      },
      {
        name: "Выполнение требований ОТ",
        tooltip: Tooltip1
      },
      {
        name: "Соблюдение дисциплины",
        tooltip: Tooltip1
      },
      {
        name: "Соответствие стандартам ББМ",
        tooltip: Tooltip2
      },
      {
        name: "Оценка Soft-skills",
        tooltip: Tooltip3
      }
    ];

    let JournalCalendar = <div>
      <Row>
        <Col xs={12} md={6}>
          <InfiniteCalendar
              Component={withRange(Calendar)}
              width={400}
              height={400}
              theme={theme}
              locale={{
                locale: require('date-fns/locale/ru'),
                headerFormat: 'MMM Do',
                todayLabel: {
                  long: 'Сегодня',
                },
                weekdays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                weekStartsOn: 1,
                blank: i18n.__('pages.JournalPage.selectWeek')
              }}
              selected={this.state.selected}
              onSelect={this.onSelectDate}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <RaisedButton
              label={i18n.__('pages.JournalPage.addWeekPlan')}
              backgroundColor={teal500}
              labelColor={fullWhite}
              onClick={this.onClickAddedButton}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <form
            ref={form => this.form = form}
          >
          <Table
            style={styles.tableStyles}
            selectable={false}
          >
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow key={"header"}>
                <TableHeaderColumn style={{width: "300px"}}>
                  ФИО
                </TableHeaderColumn>
                <TableHeaderColumn style={styles.tableHeader} />
                {TableHeaderData.map((row, index) => (
                    <TableHeaderColumn
                      tooltip={row.tooltip}
                      key={index}
                      style={styles.tableHeader}
                    >
                      {row.name}
                    </TableHeaderColumn>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} style={styles.tableWrapperStyle}>
              {filteredStudents.map((student) => (
                  <TableRow key={student._id}>
                    <TableRowColumn style={{width: "300px"}}>
                      {student.name}
                    </TableRowColumn>
                    <TableRowColumn>
                      <RaisedButton
                          backgroundColor={teal400}
                          icon={<ContentRemove />}
                          style={styles.closeButton}
                          labelColor={fullWhite}
                          onClick={() => this.handleRequestCloseProfession(student)}
                      />
                    </TableRowColumn>
                    <TableRowColumn style={styles.tableHeader}>
                      <NumberField
                        name={`points[${student._id}][]`}
                        type={"number"}
                        min={0}
                        max={5}
                        ref={input => this.points[`${student._id}_point1`] = input}
                        disabled={ student.currentProfession.journal.length >= 12}
                      />
                    </TableRowColumn>
                    <TableRowColumn style={styles.tableHeader}>
                      <NumberField
                          name={`points[${student._id}][]`}
                          type={"number"}
                          min={0}
                          max={5}
                          ref={input => this.points[`${student._id}_point2`] = input}
                          disabled={student.currentProfession.journal.length >= 12}
                      />
                    </TableRowColumn>
                    <TableRowColumn style={styles.tableHeader}>
                      <NumberField
                          name={`points[${student._id}][]`}
                          type={"number"}
                          min={0}
                          max={5}
                          ref={input => this.points[`${student._id}_point3`] = input}
                          disabled={student.currentProfession.journal.length >= 12}
                      />
                    </TableRowColumn>
                    <TableRowColumn style={styles.tableHeader}>
                      <NumberField
                          name={`points[${student._id}][]`}
                          type={"number"}
                          min={0}
                          max={5}
                          ref={input => this.points[`${student._id}_point4`] = input}
                          disabled={student.currentProfession.journal.length >= 12}
                      />
                    </TableRowColumn>
                    <TableRowColumn style={styles.tableHeader}>
                      <NumberField
                          name={`points[${student._id}][]`}
                          type={"number"}
                          min={0}
                          max={5}
                          ref={input => this.points[`${student._id}_point5`] = input}
                          disabled={student.currentProfession.journal.length >= 12}
                      />
                    </TableRowColumn>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
          </form>
        </Col>
      </Row>
    </div>;

    return (
        <div className="page lists-show">
          <div className="content-scrollable list-items">
          {loading
            ? <Message title={i18n.__('pages.JournalPage.loading')} />
            : JournalCalendar}
          <Snackbar
              open={this.state.open}
              message={this.state.message}
              autoHideDuration={4000}
              onRequestClose={this.handleRequestClose}
          />
          <Dialog
              title="Окончить обучение"
              actions={actions}
              modal={true}
              open={this.state.openDialog}
              contentStyle={styles.dialogStyle}
          />
        </div>
      </div>
    );
  }

}