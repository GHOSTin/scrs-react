import React from 'react';
import BaseComponent from '../components/BaseComponent.jsx';
import {Card, CardHeader, CardText} from "material-ui/Card";
import {Table, TableBody, TableRow, TableRowColumn} from "material-ui/Table";
import {Profession2Student} from "../../api/students/students";
import {Professions} from "../../api/professions/professions";
import {Journal} from "../../api/journal/journal";

import ActionDone from 'material-ui/svg-icons/action/done';
import ContentBlock from 'material-ui/svg-icons/content/block';
import {greenA700, red500} from 'material-ui/styles/colors';

import moment from 'moment';

export default class ResultItem extends BaseComponent {

  constructor(props){
    super(props);
  }

  currentProfession = (student) => {
    let p2s = Profession2Student.findOne({studentId: student, isClosed: false});
    if(p2s){
      return {
        profession: Professions.findOne({_id: p2s.profId}),
        journal: Journal.find({studentId: p2s.studentId, profId: p2s.profId}).fetch()
      };
    } else {
      return {
        profession: {},
        journal: []
      };
    }
  };

  isActiveJournal = (journal) => {
    let last = _.last(journal);
    if(last) {
      let a = moment(last.endDate), b = moment();
      return b.diff(a) < 8;
    }
    return true;
  };

  render(){
    let student = this.props.student;
    let {profession, journal} = this.currentProfession(student._id);
    return <Card>
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
                    {profession? profession.name: ""}
                  </TableRowColumn>
                  <TableRowColumn style={{width: 60}}>
                    {this.isActiveJournal(journal)?<ActionDone color={greenA700}/>:<ContentBlock color={red500}/>}
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
  }
}

ResultItem.propTypes = {
  student: React.PropTypes.object
};