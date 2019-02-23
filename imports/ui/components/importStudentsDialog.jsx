import React from "react";
import i18n from 'meteor/universe:i18n';
import {_} from 'lodash';
import BaseComponent from '../components/BaseComponent.jsx';
import Dialog from 'material-ui/Dialog';
import Button from '@material-ui/core/Button';
import TextField from 'material-ui/TextField';
import AttachmentButton from 'material-ui/FloatingActionButton';
import FileAttachmentIcon from '@material-ui/icons/Attachment';
//Data
import Papa from 'papaparse';
import {imports} from '../../api/students/methods';


export default class ImportStudentsDialog extends BaseComponent {
  state = {
    file: null,
    inputValue: ""
  };

  constructor(props) {
    super(props);
  }

  onChange = (file, onChange) => {
    if(file) {
      this.setState({
        file,
        inputValue: file.name
      })
    }
    this.inputFileName.blur();
  };

  onClick = (inputValue) => {
    document.getElementById("fileInput").click()
  };

  handleSave = () => {
    Papa.parse(this.state.file, {
      header: false,
      skipEmptyLines: true,
      encoding: 'windows-1251',
      complete(results){
        imports.call(results.data, (error)=>{
          if(error){
            console.log(error)
          }
        })
      }
    });
    this.props.onHide();
  };

  render() {
    const actions = [
      <Button
        color={"default"}
        disableFocusRipple={true}
        onClick={this.props.onHide}
      >Отмена</Button>,
      <Button
        color={"primary"}
        disableFocusRipple={true}
        onClick={this.handleSave}
      >{i18n.__('pages.StudentsPage.importStudents')}</Button>,
    ];

    return (
      <Dialog
        title="Импорт студентов"
        actions={actions}
        modal={true}
        open={this.props.open}
        onRequestClose={this.props.onHide}
      >
        <TextField
          fullWidth={true}
          style={{width: "90%"}}
          ref={(e)=>this.inputFileName = e}
          value={this.state.inputValue}
          hintText={i18n.__('pages.StudentsPage.pickUpCSVFile')}
          onFocus={(event) => this.onClick(event)}
        />
        <AttachmentButton
          mini={true}
          onClick={(event) => this.onClick(event)}
        >
          <FileAttachmentIcon />
        </AttachmentButton>
        <input type="file" style={{ display: 'none' }} id="fileInput" onChange={e => {
          this.onChange(e.currentTarget.files[0], null);
        }} accept=".csv"/>
      </Dialog>
    )
  }
}

ImportStudentsDialog.propTypes = {
    open: React.PropTypes.bool,
    onHide: React.PropTypes.func.isRequired
};

ImportStudentsDialog.defaultProps = {
  open: true
};