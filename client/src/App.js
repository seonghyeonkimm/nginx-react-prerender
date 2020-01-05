import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

const IndexPage = () => {
  useEffect(() => {
    // puppeteer가 cache하는 순간을 해당 전역 변수로 판단
    window.prerenderReady = true;
  }, [])

  return (
    <>
      <Helmet>
        <title>
          Index Page Title
        </title>
      </Helmet>
      <div>Index Page</div>
    </>
  );
}

const HelloPage = () => {
  useEffect(() => {
    // puppeteer가 cache하는 순간을 해당 전역 변수로 판단
    window.prerenderReady = true;
  }, [])

  return (
    <>
      <Helmet>
        <title>
          Hello Page Title
        </title>
      </Helmet>
      <div>Hello Page</div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={IndexPage} />
        <Route exact path="/hello" component={HelloPage} />
      </Switch>
    </Router>
  );
}

export default App;
