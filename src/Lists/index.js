import React from 'react';
import config from '../config.json';

const BASE_LINK = `${config.SERVE_HOSTNAME}:${config.SERVE_PORT}/`;

const ShortenList = ({ links }) => {
  return (
    <div className="links-list">
      {(links || []).map((link, index) => (
        <div
          key={`link-${link._id}-${index}`}
          className="links-item"
        >
          <a href={`http://${BASE_LINK}${link.shortId}`} target="_blank">
            {`${BASE_LINK}${link.shortId}`}
          </a>
        </div>
      ))}
    </div>
  );
}

export default ShortenList;
