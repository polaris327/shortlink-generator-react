'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShortLinkSchema = new Schema({
  shortId: {
    type: String,
    required: true
  },
  originUrl: {
    type: String,
    required: true
  }
});

const ShortLink = mongoose.model('shortLinks', ShortLinkSchema);

module.exports = ShortLink;
