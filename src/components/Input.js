import React, { Component } from 'react';
import './Input.css';

class Input extends Component {
  render() {
    return (
      <div className='wrapper'>
        <input
          id={this.props.id}
          value={this.props.url}
          placeholder={this.props.placeholder}
          onChange={this.props.onChange}
          type={this.props.type}
          autoFocus={this.props.autoFocus}
          spellCheck={false}
          className={!this.props.valid ? 'input input_invalid' : 'input'}
        />
        <span
          className={
            !this.props.valid ? 'highlight highlight--invalid' : 'highlight'
          }
        >
          {this.props.value ? this.props.value.replace(/ /g, '\u00a0') : ''}
        </span>
      </div>
    );
  }
}

export default Input;
