import React from 'react';
import { getFunName } from '../helpers';

class StorePicker extends React.Component {
  goToStore(evt) {
    evt.preventDefault();
    console.log('You Changed the URL');
    // First grab the text from the box
    console.log(this.storeInput.value);
    // Second we're going to transition from / to /store/:storeId
  }

  render() {
    return (
      <form className="store-selector" onSubmit={ this.goToStore.bind(this) }>
        { /* Comment in JSX */ }
        <h2>Please Enter A Store</h2>
        <input type="text" required placeholder="Store Name" defaultValue={ getFunName() } ref={ (input) => { this.storeInput = input }}/>
        <button type="submit">Visit Store →</button>
      </form>
    );
  }
}

export default StorePicker;
