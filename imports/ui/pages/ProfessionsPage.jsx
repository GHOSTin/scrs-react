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
import Snackbar from 'material-ui/Snackbar';

import {
  insert,
  updateText,
  remove,
} from '/imports/api/professions/methods.js';

export default class ProfessionsPage extends BaseComponent {

  state = {
    message: '',
    open: false,
  };

  constructor(props) {
    super(props);
    this.state = {...this.state, editing: undefined, open: false, value: "" };
  }

  onClickAddedButton = () => {
    insert.call({name: this.state.value}, (error)=>{
      this.setState({
        open: true
      });
      if(error){
        this.setState({
          message: 'Ошибка при добавлении профессии'
        });
        return false;
      }
      this.setState({
        message: 'Добавление прошло успешно.'
      });
      return true;
    });
    this.setState({
      value: "",
    })
  };

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    })
  };

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  };

  onClickRemove = (profession) => {
    remove.call({id: profession._id}, (error)=>{
      this.setState({
        open: true
      });
      if(error){
        this.setState({
          message: 'Ошибка при удалении профессии'
        });
        return false;
      }
      this.setState({
        message: 'Удаление прошло успешно.'
      });
      return true;
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
          <ToolbarGroup firstChild={true} style={{marginLeft: 0, width: '100%'}}>
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
                      onClick={() => this.onClickRemove(profession)}
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
          <Snackbar
              open={this.state.open}
              message={this.state.message}
              autoHideDuration={4000}
              onRequestClose={this.handleRequestClose}
          />
        </div>
      </div>
    );
  }

}