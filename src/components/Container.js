import React, { Component } from 'react';
import Input from './Input';
import Button from './Button';
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
      const response = await axios.post(`${api_url}/links/create`, {
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
    const response = await axios.post(`${api_url}/links/get`, {
      url: this.state.url,
    });
    const existing = response.data;

    if (existing) {
      this.setState({ shortened: existing.shortened });
    } else {
      const response = await axios.get(`${api_url}/links/count`);
      const hash = base62(response.data);
      this.storeLink(hash);
    }
  };

  render() {
    const link = this.state.isValid
      ? this.state.shortened
        ? this.state.shortened
        : 'Ready to shorten'
      : this.state.message;
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
