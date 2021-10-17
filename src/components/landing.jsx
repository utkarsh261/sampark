/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Paper, Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const Landing = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {

  }, []);

  //   const loadData = async () => {
  //     const response = await fetch(API_URL);
  //     const res = await response.json();
  //     setData(res);
  //     setLoading(false);
  //     console.log(res);
  //   };
  return (
      <div className="dashboard-outer-wrapper">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >

              <Typography
                variant="h4"
                style={{
                  textAlign: 'center',
                  margin: '30px 0px 0px 0px',
                  color: '#0000009c',
                }}
                display="block"
              >
                  Welcome to Sampark!
              </Typography>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              flexWrap: 'wrap',
              flexDirection: 'row',
              alignItems: 'center',
              paddingBottom: 80,
              height: '60vh',
            }}
          >
              <Link to="/board">
                  <div className="homecard">
                      <img htmlFor="photo-upload" src="http://praacticalaac-wpengine.netdna-ssl.com/wp-content/uploads/2014/08/Podd_snack.jpg" />
                  </div>
              </Link>
              <Link to="/call">
                  <div className="homecard">
                      <img htmlFor="photo-upload" src="https://techboomers.com/wp-content/uploads/2020/08/zoom-interviews.png" />
                  </div>
              </Link>
          </div>
      </div>
  );
};

export default Landing;
