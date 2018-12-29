import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Items from './components/itemsF';


class App extends Component {
  render() {
    return (
      <div className="App">
      <h1>Hello </h1>
      <Items /> 
      </div>
    );
  }
}

export default App;
