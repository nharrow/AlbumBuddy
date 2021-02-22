import React, { Component } from 'react'
import PropTypes from 'prop-types'

class List extends Component {
  render () {
    const Links = this.props.items.map((item) => {
      return (<li key={item.replace(/^\s+|\s+$/g, '')}>{item}</li>)
    })

    return (<ul>{Links}</ul>)
  }
}

List.propTypes = {
  items: PropTypes.object.isRequired
}

export default List
