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
            <Col onClick={selectTrackHandler} data-playingid={idx} xs={12}>
              <FontAwesomeIcon
                icon={['far', 'play-circle']}
              />{' '}
              {trackTitle}
            </Col>
            <Col xs={12} lg={4}>
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
        tracks: []
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

    const tracks = this.props.catalogue[this.props.artist].releases[this.props.release].tracks

    this.setState({ tracks })

    this.wavesurfer.load(
      tracks[this.state.playingid].files[0]
    )

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
            <img
              className='ReleaseCover'
              alt='Release Cover'
              src={releaseInfo.cover}
            />
          </Col>
        </Row>
      </>
    )
  }
}

ReleasePlayer.propTypes = {
  catalogue: PropTypes.object.isRequired,
  artist: PropTypes.string.isRequired,
  release: PropTypes.string.isRequired
}

export default ReleasePlayer
