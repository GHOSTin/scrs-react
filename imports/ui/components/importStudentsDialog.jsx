import React from "react";
import i18n from 'meteor/universe:i18n';
import {_} from 'lodash';
import BaseComponent from '../components/BaseComponent.jsx';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import AttachmentButton from 'material-ui/FloatingActionButton';
import FileAttachmentIcon from 'material-ui/svg-icons/file/attachment';
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
      <FlatButton
        label="Отмена"
        primary={false}
        keyboardFocused={false}
        onClick={this.props.onHide}
      />,
      <FlatButton
        label={i18n.__('pages.StudentsPage.importStudents')}
        primary={true}
        keyboardFocused={false}
        onClick={this.handleSave}
      />,
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