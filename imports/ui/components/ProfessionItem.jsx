import React from 'react';
import BaseComponent from '../components/BaseComponent.jsx';
import {Card, CardHeader, CardText} from "material-ui/Card";
import {Profession2Student} from "../../api/students/students";
import {Professions} from "../../api/professions/professions";
import {Journal} from "../../api/journal/journal";
import {greenA700, red500} from "material-ui/styles/colors";
import {List, ListItem} from "material-ui/List";
import {Table, TableBody, TableRow, TableRowColumn} from "material-ui/Table";
import {withData} from 'meteor/orionsoft:react-meteor-data'


const propTypes = {
  profession: React.PropTypes.object.isRequired,
  isLoading: React.PropTypes.bool,
  item: React.PropTypes.object
};

@withData(({profession}) => {
  const handler = Meteor.subscribe('professions');
  const isLoading = !handler.ready();
  const item = Professions.findOne(profession.profId);
  const journal = Journal.findOne({profId: profession.profId, studentId: profession.studentId});
  return {isLoading, item, journal}
})
export default class ProfessionItem extends BaseComponent{
  constructor(props){
    super(props);
  }

  render(){
    let p2s = this.props.profession;
    return <Card>
      <CardHeader
        title={
          <List>
            <ListItem
                primaryText={this.props.item.name}
                disabled={true}
            />
            <ListItem
              style={{padding: 0}}
              primaryText={
                <Table selectable={false} >
                  <TableBody displayRowCheckbox={false}>
                    <TableRow>
                      <TableRowColumn>
                        Журнал
                      </TableRowColumn>
                      <TableRowColumn>
                        оценка 1
                      </TableRowColumn>
                      <TableRowColumn>
                        оценка 2
                      </TableRowColumn>
                      <TableRowColumn>
                        оценка 3
                      </TableRowColumn>
                      <TableRowColumn>
                        оценка 4
                      </TableRowColumn>
                      <TableRowColumn>
                        оценка 5
                      </TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
              }
              disabled={true}
            />
          </List>
        }
        actAsExpander={true}
        showExpandableButton={true}
        style={{padding: "1px 0"}}
      />
      <CardText expandable={true}>

      </CardText>
    </Card>
  }
}

ProfessionItem.propTypes = propTypes;