import React from 'react';
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

const Message = ({ title, subtitle }) => (
  <div className="wrapper-message">
    {title ? <Typography variant="h5" gutterBottom>{title}</Typography> : null}
    {subtitle ? <Typography variant="subtitle1" gutterBottom>{subtitle}</Typography> : null}
  </div>
);

Message.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default Message;
