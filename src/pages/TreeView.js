// components/TreeView.js
import React, { Component } from 'react';
import { Treebeard } from 'react-treebeard';

const data = {
  name: 'root',
  toggled: true,
  children: [
    {
      name: 'parent',
      children: [
        { name: 'child1' },
        { name: 'child2' }
      ]
    }
  ]
};

class TreeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: data
    };
  }

  render() {
    return (
      <Treebeard
        data={this.state.data}
        onToggle={this.onToggle}
      />
    );
  }

  onToggle = (node, toggled) => {
    const { cursor, data } = this.state;
    if (cursor) {
      this.setState(() => ({ cursor, active: false }));
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    this.setState(() => ({ cursor: node }));
  }
}

export default TreeView;
