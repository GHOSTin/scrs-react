import React from 'react';
import BaseComponent from '../components/BaseComponent.jsx';
import {Card, CardHeader, CardText} from "material-ui/Card";
import {Table, TableBody, TableRow, TableRowColumn, TableHeader, TableHeaderColumn} from "material-ui/Table";
import {Profession2Student} from "../../api/students/students";
import {Professions} from "../../api/professions/professions";
import {Journal} from "../../api/journal/journal";

import ActionDone from 'material-ui/svg-icons/action/done';
import ContentBlock from 'material-ui/svg-icons/content/block';
import {greenA700, red500} from 'material-ui/styles/colors';

import moment from 'moment';
import {Divider} from "material-ui";

import {withData} from 'meteor/orionsoft:react-meteor-data';


@withData(({profession}) => {
  return {
    item: Professions.findOne({_id: profession.profId}),
    journal: Journal.find({studentId: profession.studentId, profId: profession.profId}, {$sort: {startDate: 1}}).fetch()
  };
})
export default class ProfessionItem extends BaseComponent{
  constructor(props){
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

  getAvgPoints = () => {
    this.props.journal.forEach((item)=>{})
  }

  render(){
    const {journal} = this.props;
    return (
        <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
          <CardHeader
              title={this.props.item.name}
              subtitle={this.state.expanded?"":
                <Table selectable={false} onCellClick={this.handleTableRowClick} style={{padding: 0}}>
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                      <TableHeaderColumn>
                        Средний балл
                      </TableHeaderColumn>
                      <TableHeaderColumn>
                        оценка 1
                      </TableHeaderColumn>
                      <TableHeaderColumn>
                        оценка 1
                      </TableHeaderColumn>
                      <TableHeaderColumn>
                        оценка 1
                      </TableHeaderColumn>
                      <TableHeaderColumn>
                        оценка 1
                      </TableHeaderColumn>
                      <TableHeaderColumn>
                        оценка 1
                      </TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                </Table>
              }
              actAsExpander={true}
              showExpandableButton={true}
          />
          <CardText expandable={true}>
            <Table selectable={false} onCellClick={this.handleTableRowClick} style={{padding: 0}}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn>
                    Средний балл
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    оценка 1
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    оценка 1
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    оценка 1
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    оценка 1
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    оценка 1
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {journal.map((list, index)=>
                  <TableRow key={list._id}>
                    <TableRowColumn>
                      Неделя {index+1}
                    </TableRowColumn>
                    {list.points.map((point, index)=>
                      <TableRowColumn key={index}>
                        {point}
                      </TableRowColumn>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardText>
        </Card>
    )
  }
}