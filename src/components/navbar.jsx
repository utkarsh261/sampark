/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */

import React from 'react';
import { Paper, Typography, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import logo from '../logo_sampark.png';

const Navbar = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const history = useHistory();
  function handleClick() {
    console.log('from history');
    history.goBack();
  }
  return (
      <div className="dashboard-outer-wrapper">
          <img src={logo} style={{ height: '10em', width: '14em', cursor: 'pointer' }} onClick={handleClick} />
      </div>
  );
};

export default Navbar;
