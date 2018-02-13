import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import './index.css';
import Readers from './Readers';
import Lessons from './Lessons';
import Lesson from './Lesson';
import registerServiceWorker from './registerServiceWorker';

const httpLink = new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cj7rr8d1c04e101462j1hrwj6' })

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <div>
        <Route exact path='/' component={Readers} />
        <Route exact path='/:reader' component={Lessons} />
        <Route path='/lesson/:id' component={Lesson} />
        <footer>
          <a href="/">McGuffey's Eclectic Readers Home</a>
        </footer>
      </div>
    </Router>
  </ApolloProvider>, document.getElementById('root'));
registerServiceWorker();
