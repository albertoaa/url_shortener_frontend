import React, { Component } from 'react';

export default class Copier extends Component {
  handleOnClick = () => {
    const el = document.createElement('textarea');
    el.value = this.props.what;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    return this.props.onCopy();
  };

  render() {
    return <div onClick={this.handleOnClick}>{this.props.children}</div>;
  }
}
