/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
import { edits } from '../utils';

export default class Trie {
  constructor() {
    this.trie = null;
    this.suggestions = [];
  }

  newNode() {
    return {
      isLeaf: false,
      children: {},
    };
  }

  add(word) {
    if (!this.trie) this.trie = this.newNode();

    let root = this.trie;
    for (const letter of word) {
      if (!(letter in root.children)) {
        root.children[letter] = this.newNode();
      }
      root = root.children[letter];
    }
    root.isLeaf = true;
  }

  find(word) {
    let root = this.trie;
    for (const letter of word) {
      if (letter in root.children) {
        root = root.children[letter];
      } else {
        return null;
      }
    }

    return root;
  }

  traverse(root, word) {
    if (root.isLeaf) {
      this.suggestions.push(word);
      return;
    }
    for (const letter in root.children) {
      this.traverse(root.children[letter], word + letter);
    }
  }

  completeAll(word, CHILDREN = null) {
    const root = this.find(word);
    if (!root) {
      const editOne = edits(word);
      for (const w of editOne) {
        this.complete(w);
      }
      return [this.suggestions, true];
    }
    return [this.complete(word), false];
  }

  complete(word, CHILDREN = null) {
    const root = this.find(word);
    if (!root) {
      return this.suggestions; // cannot suggest anything
    }
    const { children } = root;
    if (root.isLeaf) this.suggestions.push(word);
    let spread = 0;
    for (const letter in children) {
      this.traverse(children[letter], word + letter);
      spread++;

      if (CHILDREN && spread === CHILDREN) break;
    }
    return this.suggestions;
  }

  clear() {
    this.suggestions = [];
  }

  demo() {
    console.log(this.complete('he'));
  }

  print() {
    console.log(this.trie);
  }
}
