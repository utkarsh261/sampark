/* eslint-disable no-unused-vars */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Speech from 'react-speech';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const SearchBox = (props) => {
  const { value } = props;
  const [values, setValues] = React.useState({ amount: '' });
  const [string, setString] = React.useState('');

  const classes = useStyles();

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  React.useEffect(() => {
    setString(props.value.toString().split(',').join(' '));
  }, [value]);

  console.log(value);
  console.log(string);

  return (
      <div className="dashboard-outer-wrapper">
          <FormControl fullWidth className={classes.margin} variant="outlined">
              <OutlinedInput
                id="outlined-adornment-amount"
                value={string}
                onChange={handleChange('amount')}
                labelWidth={60}
              />
          </FormControl>
          <Speech
            text={string}
            textAsButton
            displayText="Speak"
            style={{ button: { color: 'red' } }}
          />
      </div>
  );
};

export default SearchBox;
