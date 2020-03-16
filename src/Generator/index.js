import React, {useState} from 'react';
import Axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import config from '../config.json';

const GENERATE_LINK = `http://${config.SERVE_HOSTNAME}:${config.SERVE_PORT}/api/links`;
const BASE_LINK = `http://${config.SERVE_HOSTNAME}:${config.SERVE_PORT}/`;

const validURL = url => {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(url);
};

const Generator = ({ addLink }) => {
  const [shorten, setShorten] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setError('');
    setUrl(e.target.value);
  };

  const generateLink = () => {
    if (!validURL(url)) {
      setError('Invalid URL');
      return;
    }
    Axios.post(GENERATE_LINK, { url }).then(result => {
      if (result.data) {
        setShorten(result.data.shortId);
        setError('');
        addLink(result.data);
      } else {
        setError('Not found');
      }
    }).catch(error => {
      setError('Failed to generate a link!');
    });
  };

  return (
    <div className="generator">
      <div className="generator-form">
        <input value={url} onChange={handleChange} />
        <button onClick={generateLink}>Shorten Link</button>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className="clipBoard-container" style={{ marginTop: '2rem' }}>
        {shorten && (
          <div className="clipBoard">
            <div className="clipBoard-text">{`${BASE_LINK}${shorten}`}</div>
            <CopyToClipboard text={`${BASE_LINK}${shorten}`}>
              <button className="clipBoard-btn">Copy</button>
            </CopyToClipboard>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;
