import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ListGroupItem } from 'react-bootstrap'

class Releases extends Component {
  constructor (props) {
    super(props)
    this.state = { ...{ artist: '', release: '' }, ...props }

    this.selectReleaseHandler = this.selectReleaseHandler.bind(this)
  }

  selectReleaseHandler (e) {
    this.props.selectRelease(e.target.dataset.release)
  }

  render () {
    if (this.props.artist === undefined || this.props.artist === '') {
      return <></>
    }

    if (this.props.catalogue[this.props.artist].releases === undefined) {
      return <></>
    }

    const List = Object.entries(
      this.props.catalogue[this.props.artist].releases
    ).map(([release, releaseData]) => {
      const releaseTitle = release === this.props.release
        ? (
          <b>{releaseData.title}</b>
        )
        : (
          releaseData.title
        )
      return (
        <ListGroupItem key={release} onClick={this.selectReleaseHandler} data-release={release}>
          {releaseTitle}
        </ListGroupItem>
      )
    })

    return List
  }
}

Releases.propTypes = {
  selectRelease: PropTypes.func.isRequired,
  catalogue: PropTypes.object.isRequired,
  artist: PropTypes.string.isRequired,
  release: PropTypes.string.isRequired
}

export default Releases
