import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar'
import Home from './pages/home/Home'
import About from './pages/about/About'
import Contact from './pages/contact/Contact'
import Login from './pages/login/Login'
import Signin from './pages/signin/Signin'
import User from './pages/user/User'
import Journal from './pages/user/Journal'
import { useAuthContext } from './hooks/useAuthContext'
import EventForm from './pages/user/EventForm';
import Events from './pages/user/Events'
import AddJournal from './pages/user/AddJournal'
import EventPage from './pages/user/EventPage';

function App() {

  const { authIsReady, user } = useAuthContext()

  return (
    <div className="App">

      {authIsReady && 
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>

          <Route path='/login'>
          { user && <Redirect to='/user' /> }
          { !user && <Login />}
          </Route>

          <Route path='/signin'>
          { user && <Redirect to='/user' /> }
          { !user && <Signin />}
          </Route>

          <Route path='/contact'>
            <Contact />
          </Route>

          <Route path='/about'>
            <About />
          </Route>

          <Route path='/user'>
            <User />
          </Route>

          <Route path='/journal'>
            <Journal />
            { !user && <Redirect to='/login'/> }
          </Route>

          <Route path='/addevent'>
            <EventForm />
            { !user && <Redirect to='/login'/> }
          </Route>

          <Route path='/events'>
            <Events />
            { !user && <Redirect to='/login'/> }
          </Route>

          <Route path='/addjournal'>
            <AddJournal />
            { !user && <Redirect to='/login'/> }
          </Route>

          <Route path='/addevent'>
            <EventForm />
            { !user && <Redirect to='/login'/> }
          </Route>

          <Route path='/event/:id'>
            <EventPage />
            { !user && <Redirect to='/login'/> }
          </Route>
        </Switch>
      </BrowserRouter>
}
    </div>
  );
}

export default App;
