import React, { Component } from 'react';

//Now we need to import the navbar here.
import Navbar from './components/layouts/Navbar'
//importing the footer
import Footer from './components/layouts/Footer'
//Importing the landing page
import Landing from './components/layouts/Landing'

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
      <Navbar/>
      <Landing/>
      <Footer/>
        
      </div>
    );
  }
}

export default App;
