import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import { Container, Row, Col, ListGroup, Card } from 'react-bootstrap'

import axios from 'axios'

import Conditional from './components/Conditional'
import Loading from './components/Loading'
import ArtistBanner from './components/ArtistBanner'
import ArtistsList from './components/ArtistsList'
import ArtistLinks from './components/ArtistLinks'
import Releases from './components/Releases'
import ReleasePlayer from './components/ReleasePlayer'

import './App.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      artists: [],
      catalogue: {},
      loading: true,
      artist: '',
      release: '',
      showReleases: false,
      bio: '',
      location: '',
      links: {}
    }

    this.selectArtist = this.selectArtist.bind(this)
    this.selectRelease = this.selectRelease.bind(this)
  }

  async componentDidMount () {
    let loading = this.state.loading
    const appOptionsResult = await axios.get('/buddy.json')

    const options = appOptionsResult.data

    const catalogueResult = await axios.get('/catalogue.json')

    let catalogue = catalogueResult.data
    const artists = Object.keys(catalogueResult.data)
    catalogue = { ...catalogue, ...{ artists } }

    loading = false

    this.setState({ catalogue, artists, options, loading })
  }

  selectArtist (artist) {
    let set = { artist: '', release: '', showReleases: false }

    if (artist !== undefined) {
      set = {
        ...set,
        ...{
          artist,
          bio: this.state.catalogue[artist].bio,
          location: this.state.catalogue[artist].location,
          links: this.state.catalogue[artist].links
        },
        ...this.state.catalogue[artist]
      }
    }

    if (artist !== this.state.artist) set.release = ''

    this.setState(set)
  }

  selectRelease (release) {
    let set = { release: '', showReleases: false }

    if (release !== undefined) {
      set = { ...set, ...{ release, showReleases: true } }
    }

    this.setState(set)
  }

  render () {
    if (this.state.loading) return <Loading />

    return (
      <Container fluid>
        <Helmet>
          <title>{this.state.options.title}</title>
        </Helmet>
        <Row>
          <Col>
            <h1>{this.state.options.title}</h1>
          </Col>
        </Row>
        <Row>
          <Col md={4} lg={2}>
            <Row>
              <Col>
                <Card>
                  <Card.Header>
                    <b>{this.state.options.roster}</b>
                  </Card.Header>
                </Card>
                <ArtistsList
                  artist={this.state.artist}
                  artists={this.state.artists}
                  catalogue={this.state.catalogue}
                  selectArtist={this.selectArtist}
                />
              </Col>
            </Row>
            <Row>
              <Col>
              </Col>
            </Row>
            <Conditional condition={this.state.artist !== ''}>
              <Conditional condition={this.state.bio !== ''}>
                <Row>
                  <Col>
                    <Card>
                      <Card.Header>
                        <b>{this.state.options.artist_info}</b>
                      </Card.Header>
                      <Card.Body>
                        <Conditional condition={this.state.location !== ''}>
                          <Row>
                            <Col><b>{this.state.options.location}:</b> {this.state.location}</Col>
                          </Row>
                        </Conditional>
                        <Row>
                          <Col>
                            <i> {this.state.bio} </i>
                          </Col>
                        </Row>

                        <Conditional condition={Object.keys(this.state.links).length > 0}>
                          <Row>
                            <Col>
                              <b>{this.state.options.links}:</b><br />
                              <ArtistLinks links={this.state.links}/>
                            </Col>
                          </Row>
                        </Conditional>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Conditional>
              <Row>
                <Col><b>{this.state.options.releases}:</b></Col>
              </Row>
              <Row>
                <Col>
                  <ListGroup>
                    <Releases
                      artist={this.state.artist}
                      release={this.state.release}
                      catalogue={this.state.catalogue}
                      selectRelease={this.selectRelease}
                    />
                  </ListGroup>
                </Col>
              </Row>
            </Conditional>
          </Col>
          <Col md={6}>
            <Conditional condition={this.state.artist !== ''}>
              <ArtistBanner
                artist={this.state.artist}
                catalogue={this.state.catalogue}
              />
              <br />
              <Conditional condition={this.state.showReleases === true}>
                <ReleasePlayer
                  artist={this.state.artist}
                  release={this.state.release}
                  catalogue={this.state.catalogue}
                />
              </Conditional>
            </Conditional>
          </Col>
          <Col>
              &nbsp;
          </Col>
        </Row>
      </Container>
    )
  }
}

export default App
