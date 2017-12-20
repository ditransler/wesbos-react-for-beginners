import React from 'react';
import base from '../base';
import AddFishForm from './AddFishForm';

class Inventory extends React.Component {
  constructor() {
    super();

    this.renderInventory = this.renderInventory.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.logout = this.logout.bind(this);

    this.state = {
      uid: null,
      owner: null
    }
  }

  componentDidMount() {
    base.onAuth((user) => {
      if (user) {
        this.authHandler(null, { user });
      }
    });
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

  authenticate(provider) {
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  authHandler(err, authData) {
    console.log(authData);
    if (err) {
      console.log(err);
      return;
    }

    // Grab the store info
    const storeRef = base.database().ref(this.props.storeId);

    // Query the firebase once for the store data
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};

      // Claim it as our own if there is no owner already
      if (!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        });
      }

      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      });
    });
  }

  logout() {
    base.unauth();
    this.setState({ uid: null });
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventrory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={ () => this.authenticate('github') }>Logi In with Github</button>
      </nav>
    )
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
        <button onClick={ () => this.props.removeFish(key) } type="button">Remove Fish</button>
      </div>
    );
  }

  render() {
    const logout = <button onClick={ () => this.logout() }>Log Out!</button>;

    // Check if a user is not logged in at all
    if (!this.state.uid) {
      return <div>{ this.renderLogin() }</div>
    }

    // Check if a user is the owner of the current store
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you aren't the owner of this store!</p>
          { logout }
        </div>
      )
    }

    return (
      <div>
        <h2>Inventory</h2>
        { logout }
        { Object.keys(this.props.fishes).map(this.renderInventory) }
        <AddFishForm addFish={ this.props.addFish }/>
        <button type="button" onClick={ this.props.loadSamples }>Load Sample Fishes</button>
      </div>
    );
  }
}

Inventory.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  updateFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  addFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  storeId: React.PropTypes.string.isRequired
};

export default Inventory;
