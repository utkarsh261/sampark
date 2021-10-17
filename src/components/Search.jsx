/* eslint-disable no-lonely-if */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useEffect, useRef } from 'react';
import PropsTypes from 'prop-types';
import axios from 'axios';
import { TextField } from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import NativeSelect from '@material-ui/core/NativeSelect';
import { matchSorter } from 'match-sorter';

import Trie from './Trie';
import { getData, getPopular } from '../utils';

const prepareOptions = (options, phrase) => {
  const result = [];
  for (const word of options) {
    const sug = `${phrase} ${word}`;
    result.push({ title: sug });
  }
  return result;
};

export default function Search(props) {
  const [options, setOptions] = useState();
  const [doYouMean, setDoYouMean] = useState(false);
  const [dropdownValue, setDropDownValue] = useState('');
  const [correctSpell, setCorrectSpell] = useState('');
  const [phrase, setPhrase] = useState('I need some'); // api completions; random default val
  const [key, setKey] = useState('');
  const keyRef = useRef(key);
  const data = useRef(null);
  const popular = useRef(null);
  const [trie, setTrie] = useState();
  const { handleNextWordChange, handleSearchClick, handleSearchBarEmpty } = props;

  useEffect(() => {
    const init = async () => {
      data.current = await getData();
      popular.current = await getPopular();
      if (data.current) {
        const temp = new Trie();
        const words = Object.keys(data.current).sort();
        words.forEach((word) => temp.add(word.toLowerCase()));
        console.log(words.length);
        console.log('INITIALIZED');
        setTrie(temp);
      }
    };
    init();
  }, []);

  const getBestMatch = (suggestions) => {
    const queue = [];
    const add = (obj) => {
      if (queue.length < 5) {
        queue.push(obj);
      } else {
        queue.sort().reverse();
        const last = queue.pop();
        last.score < obj.score ? queue.push(obj) : queue.push(last);
      }
      queue.sort().reverse();
    };
    for (const suggestion of suggestions) {
      if (suggestion in popular.current) {
        add({ word: suggestion, score: popular.current[suggestion] });
      }
    }
    const bestMatched = queue.map((a) => a.word);
    if (!bestMatched || bestMatched.length < 1) bestMatched.push(suggestions[0]);
    return bestMatched;
  };

  useEffect(() => {

  }, [correctSpell]);

  useEffect(() => {
    if (phrase.split(' ').length > 2) {
      axios.post('http://localhost:8080/complete/', {
        phrase,
      })
        .then((res) => {
          const opt = prepareOptions(res.data, phrase);
          setOptions(opt);
        });
    }
  }, [phrase]);

  useEffect(() => {
    console.log('options: ', options);
    if (options) {
      const nextWordCandidates = options.map((a) => a.title.split(' ').slice(-1)[0]);
      handleNextWordChange(nextWordCandidates);
    }
  }, options);

  const handleChange = (e) => {
    handleSearchBarEmpty(e.target.value === '');
    // if (e.target.value === ' ') setOptions({});
    const userInput = e.target.value.split(' ');
    setKey(userInput[userInput.length - 1]);
    keyRef.current = userInput[userInput.length - 1];

    if (userInput.length > 2) {
      if (e.target.value.slice(-1) === ' ') {
        setPhrase(e.target.value);
      } else {
        const compl = (trie && keyRef.current !== '') ? trie.completeAll(keyRef.current) : '';
        if (compl[1]) {
          setDoYouMean(true);
        }
        const temp = (trie && keyRef.current !== '') ? getBestMatch(compl[0]) : [];
        trie ? trie.clear() : null;
        const prev = userInput.slice(0, userInput.length - 1).join(' ');
        const opt = prepareOptions(temp, prev);
        setOptions(opt);
      }
    } else if (userInput.length === 2) {
      if (e.target.value.slice(-1) === ' ') {
        // do nothing
      } else {
        const compl = (trie && keyRef.current !== '') ? trie.completeAll(keyRef.current) : '';
        if (compl[1]) {
          setDoYouMean(true);
        }
        const temp = (trie && keyRef.current !== '') ? getBestMatch(compl[0]) : [];
        trie ? trie.clear() : null;
        const prev = userInput.slice(0, userInput.length - 1).join(' ');
        const opt = prepareOptions(temp, prev);
        setOptions(opt);
      }
    }
  };
  const handleDropdownChange = (e) => {
    console.log(e.target.value);
    setPhrase(e.target.value);
    setCorrectSpell(e.target.value);
    setDoYouMean(false);
  };

  const filterOptions = (option, { inputValue }) => {
    // console.log(option, inputValue);
    for (const opt of option) {
      console.log(opt.title, inputValue, opt.title.startsWith(inputValue));
      return opt.title.startsWith(inputValue);
    }
    return false;
    // return matchSorter(option, inputValue,
    //   { threshold: matchSorter.rankings.WORD_STARTS_WITH });
  };
  return (
      <div className="dashboard-outer-wrapper">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Autocomplete
                // freeSolo
                id="Search-box"
                options={options}
                autoHighlight
                autoComplete
                disableClearable
                getOptionLabel={(option) => option.title}
                // filterOptions={filterOptions}
                // getOptionSelected={(option, { inputValue }) =>
                //  option.title.startsWith(inputValue)}
                style={{ width: 300 }}
                renderInput={(para) => (
                    <TextField
                      {...para}
                      onChange={(e) => handleChange(e)}
                      onClick={(e) => handleSearchClick(e)}
                      label={correctSpell || ''}
                      variant="outlined"
                    />
                )}
              />
                &nbsp;
                &nbsp;
                &nbsp;
              {doYouMean && (
              <div>
                  Do you mean
                  <NativeSelect
                    id="demo-customized-select-native"
                    value={dropdownValue}
                    onChange={(e) => handleDropdownChange(e)}
                  >
                      <option aria-label="None" value="" />
                      {
                          options.map((obj) => (
                              <>
                                  <option value={obj.title}>{obj.title}</option>
                              </>
                          ))
                      }
                  </NativeSelect>
                  ?
              </div>
              )}

          </div>
      </div>
  );
}

Search.propsTypes = {
  handleNextWordChange: PropsTypes.func,
  handleSearchClick: PropsTypes.func,
  handleSearchBarEmpty: PropsTypes.func,
};

Search.defaultProps = {
  handleNextWordChange: undefined,
  handleSearchClick: undefined,
  handleSearchBarEmpty: undefined,
};
