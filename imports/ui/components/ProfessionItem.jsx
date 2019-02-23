import React from 'react';
import BaseComponent from '../components/BaseComponent.jsx';
import {Card, CardHeader, CardText} from "material-ui/Card";
import {Table, TableBody, TableRow, TableRowColumn, TableHeader, TableHeaderColumn} from "material-ui/Table";
import {Users} from "../../api/users/users";
import {Professions} from "../../api/professions/professions";
import {Journal} from "../../api/journal/journal";
import common from '@material-ui/core/colors/common';
const lightBlack = common.lightBlack;

import {_} from 'lodash';

import {withData} from 'meteor/orionsoft:react-meteor-data';
import {List, ListItem} from "material-ui/List/index";


const styles = {
  cardText: {
    paddingBottom: 0,
    paddingTop: 0,
  }
};

@withData(({profession}) => {
  return {
    item: Professions.findOne({_id: profession.profId}),
    journal: Journal.find({studentId: profession.studentId, profId: profession.profId}, {$sort: {startDate: 1}}).fetch(),
    instructor: Users.findOne({_id: profession.instructorId}),
    master: Users.findOne({_id: profession.masterId}),
    controller: Users.findOne({_id: profession.controllerId}),
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
    return _.chain(this.props.journal)
        .map(function(e) {return e.points})
        .unzip()
        .map((e) =>{return _.chain(e).meanBy(function(o){return parseInt(o)}).floor(2).value()})
        .value();
  };

  render(){
    const {journal, profession, controller, master, instructor} = this.props;
    let mean = this.getAvgPoints();
    return (
        <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
          <CardHeader
              title={<span>{this.props.item.name}&nbsp;<em>{this.state.expanded?"":`(${master?master.profile.name:null})`}</em></span>}
              actAsExpander={true}
              showExpandableButton={true}
          />
          <CardText expandable={true}>
            <List>
              <ListItem
                  primaryText={
                    <div><span style={{color: lightBlack}}>Наставник:&nbsp;&nbsp;</span>{controller?controller.profile.name:""}</div>
                  }
              />
              <ListItem
                  primaryText={
                    <div><span style={{color: lightBlack}}>Мастер:&nbsp;&nbsp;</span>{master?master.profile.name:""}</div>
                  }
              />
              <ListItem
                  primaryText={
                    <div><span style={{color: lightBlack}}>Инструктор:&nbsp;&nbsp;</span>{instructor?instructor.profile.name:""}</div>
                  }
              />
              <ListItem
                  primaryText={
                    <div>
                      <span style={{color: lightBlack}}>Цех:&nbsp;&nbsp;</span>{profession.gild}
                      <span style={{color: lightBlack}}>&nbsp;&nbsp;Участок:&nbsp;&nbsp;</span>{profession.sector}
                    </div>
                  }
              />
            </List>
          </CardText>
          <CardText style={styles.cardText}>
            <Table selectable={false} onCellClick={this.handleTableRowClick} style={{padding: 0}}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn>
                    Средний балл
                  </TableHeaderColumn>
                  {mean.map((point, index)=>
                      <TableHeaderColumn key={index}>
                        {point}
                      </TableHeaderColumn>
                  )}
                </TableRow>
              </TableHeader>
            </Table>
          </CardText>
          <CardText expandable={true} style={styles.cardText}>
            <Table selectable={false} onCellClick={this.handleTableRowClick} style={{padding: 0}}>
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