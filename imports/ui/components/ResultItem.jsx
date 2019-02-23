import React from 'react';
import BaseComponent from '../components/BaseComponent.jsx';
import {Profession2Student} from "../../api/students/students";
import {Professions} from "../../api/professions/professions";
import {Journal} from "../../api/journal/journal";
import ProfessionItem from "./ProfessionItem";

import {withData} from 'meteor/orionsoft:react-meteor-data';
import Paper from "@material-ui/core/Paper";

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

  render(){
    return (
    <Paper>
        {this.props.professionList.map((profession)=><ProfessionItem profession={profession} key={profession._id} />)}
    </Paper>
    )
  }
}

ResultItem.propTypes = propTypes;