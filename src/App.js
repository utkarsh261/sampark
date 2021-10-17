import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Landing from './components/landing';
import Board from './components/board';
import Categories from './components/categories';
import Navbar from './components/navbar';
import InputForm from './components/inputForm';
import Call from './components/call';

function App() {
  return (
      <div className="App">
          <Navbar />
          <Switch>
              <Route path="/board" exact component={Board} />
              <Route path="/categories" exact component={Categories} />
              <Route path="/" exact component={Landing} />
              <Route path="/add" exact component={InputForm} />

              <Route path="/call" exact component={Call} />

          </Switch>
      </div>
  );
}

export default App;
