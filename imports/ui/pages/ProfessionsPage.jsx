import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';
import IconButton from 'material-ui/IconButton';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import {
  insert,
  updateText,
  remove,
} from '/imports/api/professions/methods.js';

export default class ProfessionsPage extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {...this.state, editing: undefined, open: false, value: "" };
  }

  onClickAddedButton = () => {
    insert.call({name: this.state.value});
  };

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    })
  };

  render(){
    const { loading, listExists, professions } = this.props;
    if (!listExists) {
      return <NotFoundPage />;
    }
    let ProfessionsList = (
      <div>
        <Toolbar>
          <ToolbarGroup firstChild={true} style={{marginLeft: 0}}>
            <TextField
              fullWidth={true}
              name={'newProfession'}
              value = {this.state.value}
              onChange = {this.handleChange}
            />
            <RaisedButton label={i18n.__('pages.ProfessionsPage.Add')} onClick={this.onClickAddedButton}/>
          </ToolbarGroup>
        </Toolbar>
        {(!listExists || !professions.length) ?
          <Message
            title={i18n.__('pages.ProfessionsPage.noProfessions')}
            subtitle={i18n.__('pages.ProfessionsPage.addAbove')}
          />
          : <Table>
            <TableBody showRowHover={true} displayRowCheckbox={true}>
              {professions.map((profession, index) => (
                <TableRow key={profession._id}>
                  <TableRowColumn>
                    {profession.name}
                  </TableRowColumn>
                  <TableRowColumn style={{overflow: 'visible', width: 100}}>
                    <IconButton
                      tooltip="Изменить"
                      tooltipPosition='top-center'
                      onClick={() => this.onEditingChange(profession, true)}
                    >
                      <ContentRemove/>
                    </IconButton>
                  </TableRowColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }
      </div>
    );

    return (
      <div className="page lists-show">
        <div className="content-scrollable list-items">
          {loading
            ? <Message title={i18n.__('pages.ProfessionsPage.loading')} />
            : ProfessionsList}
        </div>
      </div>
    );
  }

}