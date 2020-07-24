import React, { Component } from 'react';
import Input from './Input';
import Button from './Button';
import Copier from './Copier';
import './Container.css';
import api_url from '../utils/url';
import base62 from '../utils/base62';
import axios from 'axios';

const fallbackMessage = 'Please paste a proper link...';

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      shortened: '',
      isValid: false,
      message: fallbackMessage,
    };
  }

  validate = value => {
    let { isValid } = this.state;
    isValid = /^(?:(?:(?:http(s)?):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
      value
    );
    this.setState({ isValid });
  };

  onInputChange = event => {
    const { value } = event.target;
    this.setState({ url: value });
    this.validate(value);
  };

  resetMessage = () => {
    this.setState({ message: fallbackMessage });
  };

  reset = () => {
    this.setState({
      shortened: '',
      url: '',
      isValid: false,
    });
  };

  storeLink = async hash => {
    try {
      const response = await axios.post(`${api_url}/links/store`, {
        url: this.state.url,
        shortened: hash,
      });
      this.setState({ shortened: response.data.shortened });
    } catch (error) {
      if (error.response.status === 422) {
        console.log(error.response.data);
        this.reset();
      }
    }
  };

  createShortLink = async () => {
    const { url } = this.state;
    let existing = {};
    try {
      const response = await axios.post(`${api_url}/links/get`, {
        url: url,
      });
      existing = response.data;

      if (existing) {
        this.setState({ shortened: existing.shortened });
        return;
      } else {
        const response = await axios.get(`${api_url}/links/count`);
        const hash = base62(response.data);
        this.storeLink(hash);
      }
    } catch (error) {
      console.log(error);
    }
  };

  onCopy = () => {
    this.reset();
    return new Promise((resolve, reject) => {
      this.setState({ message: 'Your link is copied!' });
      return setTimeout(() => {
        return resolve();
      }, 3000);
    }).then(() => {
      return this.resetMessage;
    });
  };

  render() {
    const link = this.state.isValid ? (
      this.state.shortened ? (
        <Copier what={this.state.shortened} onCopy={this.onCopy}>
          Click on me! Shortened: {this.state.shortened}
        </Copier>
      ) : (
        'Ready to shorten'
      )
    ) : (
      this.state.message
    );
    return (
      <div className='container'>
        <h1>URL Shortener</h1>
        <div className='link-shortened'>{link}</div>
        <Input
          value={this.state.url}
          onChange={this.onInputChange}
          type='text'
          // style={InputStyles}
          valid={this.state.isValid}
          autoFocus={true}
        />
        <Button
          onClick={() => this.createShortLink()}
          disabled={!this.state.isValid}
        >
          Shorten
        </Button>
      </div>
    );
  }
}
