import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Row, Col } from 'react-bootstrap'

import './style.css'

class ArtistBanner extends Component {
  render () {
    const artistInfo = this.props.catalogue[this.props.artist]

    return (
      <Row
        className='ArtistBanner'
        style={{
          height: 180,
          backgroundImage: `url(${artistInfo.cover})`
        }}
      >
        <Col>
          <Row>
            <Col>
              <h3>{artistInfo.name}</h3>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>{artistInfo.bio}</p>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

ArtistBanner.propTypes = {
  catalogue: PropTypes.object.isRequired,
  artist: PropTypes.string.isRequired
}

export default ArtistBanner
