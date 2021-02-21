import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ListGroup, ListGroupItem } from 'react-bootstrap'

class ArtistList extends Component {
  constructor (props) {
    super(props)
    this.selectArtistHandler = this.selectArtistHandler.bind(this)
  }

  selectArtistHandler (e) {
    this.props.selectArtist(e.target.dataset.artist)
  }

  render () {
    const List = this.props.artists.map((artist) => {
      const artistTitle = (artist === this.props.artist)
        ? (
          <b>
            {this.props.catalogue[artist].name}
          </b>
        )
        : (
          this.props.catalogue[artist].name
        )

      return (
        <ListGroupItem
          onClick={this.selectArtistHandler}
          key={artist}
          data-artist={artist}
        >
          {artistTitle}
        </ListGroupItem>
      )
    })
    return (<ListGroup>{List}</ListGroup>)
  }
}

ArtistList.propTypes = {
  selectArtist: PropTypes.func.isRequired,
  catalogue: PropTypes.object.isRequired,
  artist: PropTypes.string.isRequired,
  artists: PropTypes.array.isRequired

}

export default ArtistList
