import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Conditional extends Component {
  static get propTypes () {
    return {
      children: PropTypes.any,
      condition: PropTypes.bool.isRequired
    }
  }

  render () {
    if (this.props.condition === false) { return null }

    return (
      <>
        {this.props.children}
      </>
    )
  }
}

export default Conditional
