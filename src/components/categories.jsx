/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Paper, Typography, Button, Container,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { conv3dTranspose } from '@tensorflow/tfjs';
import SearchBox from './searchBox';
import Search from './Search';

const useStyles = makeStyles({
  root: {
    maxWidth: 300,
    maxHeight: 300,
    backgroundColor: '#fbfc8b',
    '&:hover': {
      background: '#1BCBA4',
    },
  },
  media: {
    height: 100,
    width: 100,
  },
});

const Categories = (props) => {
  const localArray = localStorage.getItem('array');
  const [stringToAdd, setStringToAdd] = useState('');
  const [searchBarEmpty, setSearchBarEmpty] = useState(false);
  const [wordToRender, setWordToRender] = useState('');
  const [category, setCategory] = React.useState('');
  const [value, setValue] = React.useState([localArray]);
  const classes = useStyles();
  const setData = (data) => {
    const symbols = data.map((obj) => obj);
    setCategory({ symbols });
  };
  React.useEffect(() => {
    if (props.location.state) {
      const recievedState = props.location.state.categories;
      const recievedValue = props.location.state.value;
      setData(recievedState);
    }
  }, [value]);

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
  const handleSearchBarEmpty = (e) => {
    setSearchBarEmpty(e);
  };

  return (
      <>
          <SearchBox value={value} />
          <Search
            handleSearchClick={(e) => handleSearchClick(e)}
            handleNextWordChange={(e) => handleNextWordChange(e)}
            handleSearchBarEmpty={(e) => handleSearchBarEmpty(e)}
          />
          <Container maxWidthLg className="dashboard-outer-wrapper">
              <BackspaceIcon
                style={{ position: 'absolute', right: 0, top: '8.3em' }}
                onClick={() => {
                  setValue('');
                  localStorage.setItem('array', '');
                }}
              />
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={2}
              >
                  {category !== ''
                    ? category.symbols.filter((d, i) => {
                      console.log(d);
                      if (!searchBarEmpty && wordToRender && wordToRender.length > 0) {
                        const toCheck = d.labelKey.split('.').splice(-1);
                        console.log('tocheck: ', toCheck, wordToRender);
                        return wordToRender.includes(toCheck[0]);
                      }
                      return d;
                    }).map((d, i) => (
                        <>
                            <Grid item xs={6} sm={3}>
                                <div aria-label={(
                                  d.labelKey.split('.')[2][0].toUpperCase()
                              + d.labelKey.split('.')[2].slice(1)
                                )
                                  .replace(/([a-z])([A-Z])/g, '$1 $2')
                                  .replace(/([A-Z])([A-Z])/g, '$1 $2')}
                                >
                                    <Card
                                      className={classes.root}
                                      key={i}
                                      onClick={() => setValue([
                                        ...value,
                                        (
                                          d.labelKey.split('.')[2][0].toUpperCase()
                            + d.labelKey.split('.')[2].slice(1)
                                        )
                                          .replace(/([a-z])([A-Z])/g, '$1 $2')
                                          .replace(/([A-Z])([A-Z])/g, '$1 $2'),
                                      ])}
                                    >
                                        <CardActionArea>
                                            <center>
                                                {' '}
                                                <CardMedia
                                                  className={classes.media}
                                                  image={d.image}
                                                  width="100px"
                                                  height="100px"
                                                  title={(
                                                    d.labelKey.split('.')[2][0].toUpperCase()
                              + d.labelKey.split('.')[2].slice(1)
                                                  )
                                                    .replace(/([a-z])([A-Z])/g, '$1 $2')
                                                    .replace(/([A-Z])([A-Z])/g, '$1 $2')}
                                                />
                                            </center>
                                            <CardContent>
                                                <Typography
                                                  variant="h5"
                                                  component="h2"
                                                  style={{ textDecoration: 'none' }}
                                                >
                                                    {(
                                                      d.labelKey.split('.')[2][0].toUpperCase()
                              + d.labelKey.split('.')[2].slice(1)
                                                    )
                                                      .replace(/([a-z])([A-Z])/g, '$1 $2')
                                                      .replace(/([A-Z])([A-Z])/g, '$1 $2')}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </div>

                            </Grid>
                        </>
                    ))
                    : null}
              </Grid>
          </Container>
      </>
  );
};

export default Categories;
