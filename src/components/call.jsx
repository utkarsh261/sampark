/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Paper, Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import logo from '../logo_sampark.png';
import VideoPlayer from './VideoPlayer';
import Sidebar from './Sidebar';
import Notifications from './Notifications';
import data from '../api/boards.json';
import { ContextProvider } from '../Context';
import Search from './Search';

const useStyles = makeStyles(() => ({

  image: {
    marginLeft: '15px',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  root: {
    maxWidth: 300,
    maxHeight: 300,
    backgroundColor: '#b5efff',
    '&:hover': {
      background: '#1BCBA4',
    },
  },
}));

const Call = () => {
  const [symbol, setSymbol] = React.useState('');
  const [message, setMessage] = React.useState('');
  React.useEffect(() => {
    if (data) {
      // eslint-disable-next-line no-use-before-define
      setData(data);
    }
  }, [data]);
  // eslint-disable-next-line no-shadow
  const setData = (data) => {
    const symbols = data.advanced[1].tiles.map((obj) => obj);
    setSymbol({ symbols });
  };
  console.log(symbol.symbols);
  const classes = useStyles();
  return (
      <>
          <div className="quick-chat">
              {symbol !== '' ? symbol.symbols.map((d, i) => (
                  <>
                      <Card className={classes.root} key={i} onClick={() => setMessage(((d.labelKey.split('.')[2][0].toUpperCase() + d.labelKey.split('.')[2].slice(1)).replace(/([a-z])([A-Z])/g, '$1 $2')).replace(/([A-Z])([A-Z])/g, '$1 $2'))}>
                          <CardActionArea>
                              <center>
                                  <img src={d.image} style={{ height: 100, widtch: 100 }} />
                              </center>
                              <CardContent>
                                  <Typography variant="h5" component="h2" style={{ textDecoration: 'none' }}>
                                      {((d.labelKey.split('.')[2][0].toUpperCase() + d.labelKey.split('.')[2].slice(1)).replace(/([a-z])([A-Z])/g, '$1 $2')).replace(/([A-Z])([A-Z])/g, '$1 $2')}
                                  </Typography>
                              </CardContent>
                          </CardActionArea>
                      </Card>
                  </>
              )) : null}
          </div>
          <div className={classes.wrapper}>
              <Search
                handleSearchClick={(e) => (e)}
                handleNextWordChange={(e) => (e)}
                handleSearchBarEmpty={(e) => (e)}
              />
              <ContextProvider>
                  <VideoPlayer message={message} />
                  <Sidebar>
                      <Notifications />
                  </Sidebar>
              </ContextProvider>
          </div>
      </>
  );
};

export default Call;
