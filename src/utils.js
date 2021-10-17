/* eslint-disable no-plusplus */
/* eslint-disable no-return-await */
import { DATA_URL, POPULAR_URL } from './constants';

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

const getData = async () => {
  const url = DATA_URL;
  let res;
  try {
    res = await fetch(url, {
      method: 'GET',
    });
  } catch (e) {
    console.log(e);
  }
  return await res.json();
};

const getPopular = async () => {
  const url = POPULAR_URL;
  const res = await fetch(url, {
    method: 'GET',
  });
  let text = await res.text();
  const popular = {};
  text = text.split('\n');
  const TOTAL = text.length;
  text.forEach((word, freq) => {
    if (word !== '') {
      popular[word.toLowerCase()] = TOTAL - freq;
    }
  });
  return popular;
};

const edits = (word) => {
  const results = [];
  for (let i = 0; i < word.length; i++) { results.push(word.slice(0, i) + word.slice(i + 1)); }
  for (let i = 0; i < word.length - 1; i++) {
    results.push(word.slice(0, i)
    + word.slice(i + 1, i + 2) + word.slice(i, i + 1) + word.slice(i + 2));
  }
  for (let i = 0; i < word.length; i++) {
    letters.forEach((l) => {
      results.push(word.slice(0, i) + l + word.slice(i + 1));
    });
  }
  for (let i = 0; i <= word.length; i++) {
    letters.forEach((l) => {
      results.push(word.slice(0, i) + l + word.slice(i));
    });
  }
  return results;
};

export { getData, getPopular, edits };
