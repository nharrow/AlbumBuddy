import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Row, Col, ListGroup, ListGroupItem, Button } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far, faPlayCircle } from '@fortawesome/free-regular-svg-icons'
import { fas, faDownload } from '@fortawesome/free-solid-svg-icons'

import WaveSurfer from 'wavesurfer.js'

import { saveAs } from 'file-saver'

import Conditional from '../Conditional'
import Loading from '../Loading'
import Links from '../Links'

import './style.css'

library.add(far, faPlayCircle, fas, faDownload)

function TrackList ({
  catalogue,
  artist,
  release,
  playingid,
  selectTrackHandler,
  tracks
}) {
  const List = tracks.map(
    (trackInfo, idx) => {
      const trackTitle =
        idx === playingid
          ? <b>{trackInfo.title}</b>
          : trackInfo.title

      const DownloadLinks = trackInfo.files.map((trackFile, idx) => {
        const trackFileExtension = trackFile.split('.').slice(-1)[0].toUpperCase()
        const trackFileName = trackFile.split('/').slice(-1)[0]

        return (<Button key={idx} variant="info" className="TrackButton" onClick={() => { saveAs(trackFile, trackFileName) }}>{trackFileExtension}</Button>)
      })

      return (
        <ListGroupItem key={idx} className="Track">
          <Row className="snug">
            <Col onClick={selectTrackHandler} data-playingid={idx} md={12} lg={8}>
              <FontAwesomeIcon
                icon={['far', 'play-circle']}
              />{' '}
              {trackTitle}
            </Col>
            <Col xs={12} sm={12} md={12} lg={4}>
              <span className="pull-right"><FontAwesomeIcon icon={['fa', 'download'] } />&nbsp;{DownloadLinks}</span>
            </Col>
          </Row>
        </ListGroupItem>
      )
    }
  )
  return List
}

class ReleasePlayer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...{
        artist: '',
        release: '',
        playingid: 0,
        catalogue: {},
        playing: false,
        loading: true,
        tracks: [],
        info: '',
        credits: {
          writing: [],
          performance: [],
          production: [],
          engineering: []
        }
      },
      ...props
    }

    this.selectTrackHandler = this.selectTrackHandler.bind(this)
    this.playPauseHandler = this.playPauseHandler.bind(this)

    this.waveform = React.createRef()
  }

  componentDidMount () {
    this.wavesurfer = WaveSurfer.create({
      container: this.waveform.current,
      waveColor: 'grey',
      progressColor: 'purple',
      responsive: true,
      fillParent: true,
      backend: 'MediaElement',
      cursorWidth: 0
    })

    const release = this.props.catalogue[this.props.artist].releases[this.props.release]

    const tracks = release.tracks

    const info = release.info !== undefined ? release.info : ''
    const credits = release.credits !== undefined ? release.credits : { writing: [], production: [], engineering: [] }

    let stateUpdate = {}
    stateUpdate = { ...stateUpdate, ...{ tracks, info, credits } }

    this.setState(stateUpdate)

    // this.wavesurfer.load(
    //   tracks[this.state.playingid].files[0]
    // )

    this.wavesurfer.on('ready', () => {
      this.wavesurfer.play()
      this.setState({ loading: false, playing: true })
    })

    this.wavesurfer.on('seek', (progress) => {
      if (!this.wavesurfer.isPlaying()) { this.wavesurfer.play() }

      this.setState({ playing: this.wavesurfer.isPlaying() })
    })

    this.wavesurfer.on('finish', () => {
      this.setState({ loading: true })

      const playingid = ((this.state.playingid + 1) % this.state.tracks.length)

      this.wavesurfer.load(
        tracks[playingid].files[0]
      )

      this.setState({ playingid: playingid, playing: true })
    })

    this.wavesurfer.on('pause', () => {
      this.wavesurfer.params.container.style.opacity = 0.7
    })

    this.wavesurfer.on('play', () => {
      this.wavesurfer.params.container.style.opacity = 1
    })
  }

  componentWillUnmount () {
    this.wavesurfer.stop()
    this.wavesurfer.empty()
    this.wavesurfer.destroy()
  }

  selectTrackHandler (e) {
    const playingidSrc = e.target.dataset.playingid
    const playingid = parseInt(playingidSrc)

    if (playingidSrc === undefined) {
      this.wavesurfer.playPause()
      this.setState({ playing: this.wavesurfer.isPlaying() })
    } else if (
      this.props.catalogue[this.props.artist].releases[this.props.release]
        .tracks[playingid] !== undefined &&
      playingid !== this.state.playingid
    ) {
      this.wavesurfer.pause()
      this.setState({ loading: true })
      this.wavesurfer.load(
        this.state.tracks[playingid].files[0]
      )
      this.setState({ playingid: playingid, playing: true })
    }
  }

  playPauseHandler () {
    this.wavesurfer.playPause()
    this.setState({ playing: this.wavesurfer.isPlaying() })
  }

  render () {
    if (
      this.props.artist === undefined ||
      this.props.release === undefined ||
      this.props.artist === '' ||
      this.props.release === ''
    ) { return <></> }

    const releaseInfo = this.props.catalogue[this.props.artist].releases[
      this.props.release
    ]

    const credits = {}
    credits.engineering = (releaseInfo.credits !== undefined && releaseInfo.credits.engineering !== undefined) ? releaseInfo.credits.engineering : []
    credits.performance = (releaseInfo.credits !== undefined && releaseInfo.credits.performance !== undefined) ? releaseInfo.credits.performance : []
    credits.production = (releaseInfo.credits !== undefined && releaseInfo.credits.production !== undefined) ? releaseInfo.credits.production : []
    credits.writing = (releaseInfo.credits !== undefined && releaseInfo.credits.writing !== undefined) ? releaseInfo.credits.writing : []
    const hasEngineeringCredits = credits.engineering.length > 0
    const hasPerformanceCredits = credits.performance.length > 0
    const hasProductionCredits = credits.production.length > 0
    const hasWritingCredits = credits.writing.length > 0

    const hasCredits = hasEngineeringCredits || hasPerformanceCredits || hasProductionCredits || hasWritingCredits

    return (
      <>
        <Row>
          <Col xs={12} sm={12} md={8} lg={8}>
            <h4>{releaseInfo.title}</h4>
            <Row>
              <Col>
                <div id="PlayPause">
                  <FontAwesomeIcon
                    icon={['far', (this.state.playing === true ? 'pause-circle' : 'play-circle')]}
                    size="3x"
                    onClick={this.playPauseHandler}
                  />
                </div>
                <div id='waveform' ref={this.waveform}>
                  <Conditional condition={this.state.loading}>
                    <Loading colour="#eeeeee" />
                  </Conditional>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <ListGroup>

                  <TrackList
                    artist={this.props.artist}
                    release={this.props.release}
                    catalogue={this.props.catalogue}
                    playingid={this.state.playingid}
                    tracks={this.state.tracks}
                    selectTrackHandler={this.selectTrackHandler}
                  />
                </ListGroup>
              </Col>
            </Row>
          </Col>
          <Col xs={12} sm={12} md={4} lg={4}>
            <Row>
              <img
                className='ReleaseCover'
                alt='Release Cover'
                src={releaseInfo.cover}
              />
            </Row>
            <Conditional condition={releaseInfo.info !== undefined}>
              <Row>
                <b>Release Info</b>
              </Row>
              <Row>
                {releaseInfo.info}
              </Row>
            </Conditional>
            <Conditional condition={releaseInfo.links !== undefined && typeof releaseInfo.links === 'object' && Object.keys(releaseInfo.links).length > 0}>
              <Row>
                <b>{this.props.options.release_links}</b>
              </Row>
              <Row>
                <Links links={releaseInfo.links} />
              </Row>
            </Conditional>
            <Conditional condition={hasCredits === true}>
              <Row>
                <b>{this.props.options.credits}</b>
              </Row>
              <Conditional condition={hasEngineeringCredits}>
                <Row>
                  <b>{this.props.options.credits_engineering}</b><br />
                  <i>{credits.engineering.join(', ')}</i>
                </Row>
              </Conditional>
              <Conditional condition={hasPerformanceCredits}>
                <Row>
                  <b>{this.props.options.credits_performance}</b><br />
                  <i>{credits.performance.join(', ')}</i>
                </Row>
              </Conditional>
              <Conditional condition={hasProductionCredits}>
                <Row>
                  <b>{this.props.options.credits_production}</b><br />
                  <i>{credits.production.join(', ')}</i>
                </Row>
              </Conditional>
              <Conditional condition={hasWritingCredits}>
                <Row>
                  <b>{this.props.options.credits_writing}</b><br />
                  <i>{credits.writing.join(', ')}</i>
                </Row>
              </Conditional>
            </Conditional>
          </Col>
        </Row>
      </>
    )
  }
}

ReleasePlayer.propTypes = {
  catalogue: PropTypes.object.isRequired,
  artist: PropTypes.string.isRequired,
  release: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired
}

export default ReleasePlayer
