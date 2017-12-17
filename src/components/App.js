import React from 'react';
import base from '../base';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';

class App extends React.Component {
  constructor() {
    super();

    this.addFish = this.addFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);

    // initial state
    this.state = {
      fishes: {},
      order: {}
    };
  }

  componentWillMount() {
    // This runs right before the <App> is rendered
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });

    // Check if there is any order in localStorage
    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

    if (localStorageRef) {
      // Update our App component's order state
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  }

  addFish(fish) {
    // Update our state
    const fishes = { ...this.state.fishes };
    // Add our new fish
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    // Set state
    this.setState({ fishes });
  }

  loadSamples() {
    this.setState({
      fishes: sampleFishes
    });
  }

  addToOrder(key) {
    // Take a copy of our state
    const order = { ...this.state.order };
    // Update or add the number of fish ordered
    order[key] = order[key] + 1 || 1;
    // Update our state
    this.setState({ order });
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
          <ul className="list-of-fishes">
            {
              Object.keys(this.state.fishes)
                .map((key) => <Fish key={ key } index={ key } details={ this.state.fishes[key] } addToOrder={ this.addToOrder }/>)
            }
          </ul>
        </div>
        <Order
          fishes={ this.state.fishes }
          order={ this.state.order }
          params={ this.params }
        />
        <Inventory addFish={ this.addFish } loadSamples={ this.loadSamples }/>
      </div>
    );
  }
}

export default App;
