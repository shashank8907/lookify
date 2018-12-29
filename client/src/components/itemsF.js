import React, { Component } from 'react';

class Items extends Component {
  constructor() {
    super();
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    fetch('/api/items')
      .then(res => res.json())
      .then(items => this.setState({items}, () => console.log('items fetched...', items)));
  }

  render() {
    return (
      <div>
        <h2>items</h2>
        <ul>
        {this.state.items.map(item => 
          <li key={item._id}>{item.itemName} {item.retar5ilerName} {item._id} {item.price}</li>
        )}
        </ul>
      </div>
    );
  }
}

export default Items;