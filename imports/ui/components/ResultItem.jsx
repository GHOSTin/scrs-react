import React from 'react';
import BaseComponent from '../components/BaseComponent.jsx';
import {Card, CardHeader, CardText} from "material-ui/Card";
import {Table, TableBody, TableRow, TableRowColumn} from "material-ui/Table";
import {Profession2Student} from "../../api/students/students";
import {Professions} from "../../api/professions/professions";
import {Journal} from "../../api/journal/journal";
import ProfessionItem from "./ProfessionItem";


import ActionDone from 'material-ui/svg-icons/action/done';
import ContentBlock from 'material-ui/svg-icons/content/block';
import {greenA700, red500} from 'material-ui/styles/colors';

import moment from 'moment';
import {Divider} from "material-ui";

import {withData} from 'meteor/orionsoft:react-meteor-data';

const propTypes = {
  student: React.PropTypes.object.isRequired,
  profession: React.PropTypes.object,
  journal: React.PropTypes.array,
};

@withData(({student}) => {
  const professionList = Profession2Student.find({studentId: student._id}, {$sort: {createAt: 1}}).fetch();
  let p2s = Profession2Student.findOne({studentId: student._id, isClosed: false});
  if(p2s){
    return {
      profession: Professions.findOne({_id: p2s.profId}),
      journal: Journal.find({studentId: p2s.studentId, profId: p2s.profId}).fetch(),
      professionList
    };
  } else {
    return {
      profession: {},
      journal: [],
      professionList
    };
  }
})
export default class ResultItem extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleTableRowClick = () => {
    this.setState({expanded: !this.state.expanded});
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
    let {student, profession, journal} = this.props;
    return <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
      <CardHeader
          title={
            <Table selectable={false} onCellClick={this.handleTableRowClick} >
              <TableBody displayRowCheckbox={false}>
                <TableRow>
                  <TableRowColumn style={{width: "20%", whiteSpace: "normal"}}>
                    {student.name}
                  </TableRowColumn>
                  <TableRowColumn style={{whiteSpace: "normal"}}>
                    {student.speciality}
                  </TableRowColumn>
                  <TableRowColumn style={{width: 120}}>
                    {student.year}
                  </TableRowColumn>
                  <TableRowColumn style={{width: "30%", whiteSpace: "normal"}}>
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
      <Divider/>
      <CardText expandable={true}>
        {this.props.professionList.map((profession)=><ProfessionItem profession={profession} key={profession._id} />)}
      </CardText>
    </Card>
  }
}

ResultItem.propTypes = propTypes;