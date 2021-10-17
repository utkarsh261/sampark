/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Typography, Container } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import data2 from '../api/boards.json';
import data from '../api/mulberry-symbols.json';
import SearchBox from './searchBox';
import Search from './Search';

const useStyles = makeStyles({
  root: {
    maxWidth: 300,
    maxHeight: 300,
    backgroundColor: '#b5efff',
    '&:hover': {
      background: '#1BCBA4',
    },
  },
  media: {
    height: 100,
    width: 100,
  },
  fab: {
    margin: 0,
  },
  absolute: {
    position: 'fixed',
    bottom: '5vh',
    right: '5vw',
  },
});

const Board = () => {
  const [stringToAdd, setStringToAdd] = useState('');
  const localArray = localStorage.getItem('array');
  const [value, setValue] = React.useState([localArray]);
  const [wordToRender, setWordToRender] = useState([]);
  const [symbol, setSymbol] = React.useState('');
  const [board, setBoard] = React.useState('');
  const classes = useStyles();
  const setData = (d) => {
    const symbols = d.map((obj) => obj);
    setSymbol({ symbols });
  };
  const setData2 = (d) => {
    const boards = d.advanced.map((obj) => obj);
    setBoard({ boards });
  };
  React.useEffect(() => {
    if (data) {
      setData(data);
    }
    if (data2) {
      setData2(data2);
    }
  }, [data, data2]);

  localStorage.setItem('array', value);
  console.log(value);

  const handleNextWordChange = (e) => {
    console.log('Next words: ', e);
    setWordToRender(e);
  };
  const handleSearchClick = (e) => {
    console.log('string to append: ', e.target.value);
    setStringToAdd(e.target.value);
    setValue([
      ...value,
      e.target.value,
    ]);
  };
  return (
      <>
          <SearchBox value={value} />
          <Search
            handleSearchClick={(e) => handleSearchClick(e)}
            handleNextWordChange={(e) => handleNextWordChange(e)}
          />
          <Container maxWidthLg className="dashboard-outer-wrapper">
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={2}
              >
                  {board !== ''
                    ? board.boards.filter((d, i) => {
                      console.log(d);
                      return d;
                    }).map((d, i) => (
                        <>
                            <Grid item xs={6} sm={3}>
                                <Link
                                  to={{
                                    pathname: '/categories',
                                    state: { categories: d.tiles },
                                  }}
                                >
                                    <div aria-label={(
                                      d.nameKey.split('.')[2][0].toUpperCase()
                              + d.nameKey.split('.')[2].slice(1)
                                    )
                                      .replace(/([a-z])([A-Z])/g, '$1 $2')
                                      .replace(/([a-z])([A-Z])/g, '$1 $2')}
                                    >
                                        <Card
                                          className={classes.root}
                                          key={i}
                                        >
                                            <CardActionArea>
                                                <center>
                                                    {' '}
                                                    <CardMedia
                                                      className={classes.media}
                                                      image={d.tiles[0].image}
                                                      width="100px"
                                                      height="100px"
                                                      title={(
                                                        d.nameKey.split('.')[2][0].toUpperCase()
                              + d.nameKey.split('.')[2].slice(1)
                                                      )
                                                        .replace(/([a-z])([A-Z])/g, '$1 $2')
                                                        .replace(/([a-z])([A-Z])/g, '$1 $2')}
                                                    />
                                                </center>
                                                <CardContent>
                                                    <Typography
                                                      variant="h5"
                                                      component="h2"
                                                      style={{ textDecoration: 'none' }}
                                                    >
                                                        {(
                                                          d.nameKey.split('.')[2][0].toUpperCase()
                              + d.nameKey.split('.')[2].slice(1)
                                                        )
                                                          .replace(/([a-z])([A-Z])/g, '$1 $2')
                                                          .replace(/([a-z])([A-Z])/g, '$1 $2')}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </div>

                                </Link>
                            </Grid>
                        </>
                    ))
                    : null}
              </Grid>
              <Tooltip title="Add" aria-label="add">
                  <Link to="/add">
                      <Fab color="secondary" className={classes.absolute}>
                          <AddIcon />
                      </Fab>
                  </Link>
              </Tooltip>
          </Container>
      </>
  );
};

export default Board;
