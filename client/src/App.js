import React from 'react';
import './App.css';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import HomePage from './components/homePage/homePage';
import Dashboard from './components/dashboard/dashboard';

function App() {
  return (
    <BrowserRouter>
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/dashboard" component={Dashboard} />s
        </Switch>
      </BrowserRouter>
  );
}

export default App;
