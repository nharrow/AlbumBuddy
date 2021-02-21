import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ArtistLinks extends Component {
  render () {
    const Links = Object.entries(this.props.links).map(([title, link]) => {
      return (<li key={title}><a href={link}>{title}</a><br /></li>)
    })

    return (<ul>{Links}</ul>)
  }
}

ArtistLinks.propTypes = {
  links: PropTypes.object.isRequired
}

export default ArtistLinks
