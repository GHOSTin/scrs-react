import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';
import IconButton from 'material-ui/IconButton';
import ContentCreate from 'material-ui/svg-icons/content/create';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class ProfessionsPage extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, { editing: undefined, open: false });
  }

  render(){
    const { loading, listExists, professions } = this.props;
    if (!listExists) {
      return <NotFoundPage />;
    }
    let ProfessionsList = (!listExists || !professions.length)? (
      <Message
        title={i18n.__('pages.ProfessionsPage.noProfessions')}
        subtitle={i18n.__('pages.ProfessionsPage.addAbove')}
      />
    ) : (
      <div>
        <Toolbar>
          <ToolbarGroup firstChild={true}>
            <TextField fullWidth={true} />
            <RaisedButton label={i18n.__('pages.ProfessionsPage.Add')}/>
          </ToolbarGroup>
        </Toolbar>
        <Table>
          <TableBody showRowHover={true} displayRowCheckbox={true}>
            {professions.map((profession,index) => (
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
                    <ContentCreate/>
                  </IconButton>
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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