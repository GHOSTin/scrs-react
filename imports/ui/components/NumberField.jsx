import React from 'react';
import TextField from 'material-ui/TextField';

const getValidDefaultValue = (defaultValue, props) => {
  let validDefaultValue = +defaultValue;

  if (isNaN(validDefaultValue)) {
    validDefaultValue = 0;
  }

  if (validDefaultValue < props.min) {
    validDefaultValue = props.min;
  }

  if (validDefaultValue > props.max) {
    validDefaultValue = props.max;
  }

  return validDefaultValue;
};

const getValidValue = (value, defaultValue, props) => {
  let validValue = +value;

  if (isNaN(validValue)) {
    validValue = defaultValue || '';
  }

  if (validValue < props.min) {
    validValue = defaultValue || props.min;
  }

  if (validValue > props.max) {
    validValue = defaultValue || props.max;
  }

  return validValue;
};

export default class NumberInput extends React.Component {
  static defaultProps = {
    min: Number.NEGATIVE_INFINITY,
    max: Number.POSITIVE_INFINITY,

    onFocus: () => {},
    onBlur: () => {},
    onChange: () => {},
  };
  static propTypes = {
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    value: React.PropTypes.number,
    defaultValue: React.PropTypes.number,
    disabled: React.PropTypes.bool,
    floatingLabelText: React.PropTypes.string,
    min: React.PropTypes.number,
    max: React.PropTypes.number,

    onFocus: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
  };
  constructor(props) {
    super(props);

    this.state = { };
    if (props.defaultValue) {
      this.state.defaultValue = getValidDefaultValue(this.props.defaultValue, props);
    }
    this.state.value = getValidValue(props.value, this.state.defaultValue, props);

    this.oldValue = this.state.value;
  }
  blurHandler = (...props) => {
    let newValue = this.state.value;
    let isFixed = false;

    if (newValue < this.props.min) {
      newValue = this.props.min;
      isFixed = true;
    }
    if (newValue > this.props.max) {
      newValue = this.props.max;
      isFixed = true;
    }

    if (this.oldValue !== newValue || isFixed) {
      this.setState({ value: newValue });
      this.oldValue = newValue;
    }

    this.props.onBlur(...props);
  };
  changeHandler = (e, newValue) => {
    if (!isNaN(newValue)) {
      if(newValue !== '') {
        newValue = getValidValue(newValue, '', this.props);
      }
      this.setState({ value: newValue });
      this.props.onChange(e);
    }
  };
  render() {
    return (
      <TextField
        className="number=field"

        id={this.props.id}
        name={this.props.name}
        value={this.state.value}
        disabled={this.props.disabled}
        floatingLabelText={this.props.floatingLabelText}

        onChange={this.changeHandler}
        onFocus={this.props.onFocus}
        onBlur={this.blurHandler}
      />
    );
  }
}