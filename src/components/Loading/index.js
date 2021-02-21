import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FadeLoader from 'react-spinners/FadeLoader'

import './style.css'

class Loading extends Component {
  render () {
    return (
      <div id='loading-icon'>
        <FadeLoader
          height={32}
          width={5}
          radius={5}
          margin={15}
          color={
            this.props.colour !== undefined ? this.props.colour : '#F5A623'
          }
        />
      </div>
    )
  }
}

Loading.propTypes = {
  colour: PropTypes.string
}

export default Loading
