import React from 'react';
import BaseComponent from '../components/BaseComponent.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Snackbar from 'material-ui/Snackbar';

import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import {locales} from 'react-pivottable/Utilities';

// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);

export default class ProfessionsPage extends BaseComponent {

  state = {
    message: '',
    open: false,
  };

  constructor(props) {
    super(props);
    this.state = {...props, ...this.state, editing: undefined, open: false, value: "" };
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  };

  render(){
    const { loading, listExists, students } = this.props;
    if (!listExists) {
      return <NotFoundPage />;
    }

    return (
        <div className="page lists-show">
          <div className="content-scrollable list-items">
            <PivotTableUI
                data={students}
                onChange={s => this.setState(s)}
                renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                {...this.state}
            />
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