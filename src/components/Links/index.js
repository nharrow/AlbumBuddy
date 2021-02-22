import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Links extends Component {
  render () {
    const Links = Object.entries(this.props.links).map(([title, link]) => {
      return (<li key={title}><a href={link}>{title}</a></li>)
    })

    return (<ul>{Links}</ul>)
  }
}

Links.propTypes = {
  links: PropTypes.object.isRequired
}

export default Links
