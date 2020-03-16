import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import logo from './logo.svg';
import Generator from './Generator';
import Lists from './Lists';
import './App.css';

import config from './config.json';

const LINKS_URL = `http://${config.SERVE_HOSTNAME}:${config.SERVE_PORT}/api/links`;

const App = () => {
  const [links, setLinks] = useState(null);

  const fetchLinks = () => {
    Axios.get(LINKS_URL).then(result => {
      if (result.data) {
        setLinks(result.data);
      }
    }).catch(error => {
      setLinks([]);
    });
  }

  useEffect(() => {
    if (!links) {
      fetchLinks();
    }
  }, []);

  const addLinks = link => {
    let newLinks = links ? [...links] : [];
    const indexOfLink = newLinks.findIndex(li => li._id === link._id);
    if (indexOfLink) {
      newLinks.splice(indexOfLink, 1, link);
    } else {
      newLinks.push(link);
    }
    setLinks(newLinks);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Replace me with shortlinks UI</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="App-container">
        <Generator addLink={addLinks} />
        <Lists links={links} />
      </div>
    </div>
  );
}

export default App;
