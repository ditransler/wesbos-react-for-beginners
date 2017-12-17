import React from 'react';
import AddFishForm from './AddFishForm';

class Inventory extends React.Component {
  constructor() {
    super();

    this.renderInventory = this.renderInventory.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt, key) {
    const fish = this.props.fishes[key];
    // Take a copy of that fish and update it with the new data
    const updatedFish = {
      ...fish,
      [evt.target.name]: evt.target.value
    };

    this.props.updateFish(key, updatedFish);
  }

  renderInventory(key) {
    const fish  = this.props.fishes[key];

    return (
      <div className="fish-edit" key={ key }>
        <input type="text" name="name" value={ fish.name } placeholder="Fish Name" onChange={ (evt) => this.handleChange(evt, key) }/>
        <input type="text" name="price" value={ fish.price } placeholder="Fish Price" onChange={ (evt) => this.handleChange(evt, key) }/>
        <select name="status" value={ fish.status } onChange={ (evt) => this.handleChange(evt, key) }>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" name="desc" value={ fish.desc } placeholder="Fish Desc" onChange={ (evt) => this.handleChange(evt, key) }></textarea>
        <input type="text" name="image" value={ fish.image } placeholder="Fish Image" onChange={ (evt) => this.handleChange(evt, key) }/>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h2>Inventory</h2>
        { Object.keys(this.props.fishes).map(this.renderInventory) }
        <AddFishForm addFish={ this.props.addFish }/>
        <button type="button" onClick={ this.props.loadSamples }>Load Sample Fishes</button>
      </div>
    );
  }
}

export default Inventory;
