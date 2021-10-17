/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/media-has-caption */

import React, {
  useContext, useRef, useState, useEffect,
} from 'react';
import {
  Grid, Typography, Paper, makeStyles, Button,
} from '@material-ui/core';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import Webcam from 'react-webcam';
import * as fp from 'fingerpose';
import drawHand from '../api/utilities';
import { SocketContext } from '../Context';

import { loveYouGesture } from '../models/LoveYou';
import { helloGesture } from '../models/Hello';
import { countOneGesture } from '../models/Count_one';
import { thumbsDownGesture } from '../models/ThumbsDown';

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    margin: '10px',
    width: '550px',
  },
}));

const VideoPlayer = (props) => {
  const {
    name, callAccepted, myVideo, userVideo, callEnded, stream, call, videoCamOff,
  } = useContext(SocketContext);
  const { message } = props;
  const classes = useStyles();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  /// ////// NEW STUFF ADDED STATE HOOK
  const [emoji, setEmoji] = useState(null);
  /// ////// NEW STUFF ADDED STATE HOOK
  console.log(emoji);
  const runHandpose = async () => {
    const net = await handpose.load();
    console.log('Handpose model loaded.');
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== 'undefined'
      && webcamRef.current !== null
      && webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const { video } = webcamRef.current;
      const { videoWidth } = webcamRef.current.video;
      const { videoHeight } = webcamRef.current.video;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const hand = await net.estimateHands(video);
      //  console.log(hand);

      /// ////// NEW STUFF ADDED GESTURE HANDLING

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
          loveYouGesture,
          helloGesture,
          countOneGesture,
          thumbsDownGesture,
        ]);
        const gesture = await GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          // console.log(gesture.gestures);

          const confidence = gesture.gestures.map(
            (prediction) => prediction.confidence,
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence),
          );
          // console.log(gesture.gestures[maxConfidence].name);
          setEmoji(gesture.gestures[maxConfidence].name);
          // console.log(emoji);
        }
      }
      /// ////// NEW STUFF ADDED GESTURE HANDLING

      // Draw mesh
      const ctx = canvasRef.current.getContext('2d');
      drawHand(hand, ctx);
    }
  };
  useEffect(() => { runHandpose(); }, []);
  return (
      <>
          {/* NEW STUFF */}
          <Grid container className={classes.gridContainer}>
              {stream && (
              <Paper className={classes.paper}>
                  <Grid item xs={12} md={6}>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                      >
                          <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
                          {/* <Button variant="contained" color="secondary" onClick={() => videoCamOff()} className={classes.margin}>
                              Toggle Video
                          </Button> */}
                      </div>
                      <Webcam
                        ref={webcamRef}
                        style={{

                          marginLeft: 'auto',
                          marginRight: 'auto',
                          left: 0,
                          right: 0,
                          textAlign: 'center',
                          zindex: 9,
                          width: 550,
                          height: 400,
                          display: 'hidden',
                        }}
                      />

                      <canvas
                        ref={canvasRef}
                        style={{
                          position: 'relative',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          marginTop: '-400px',
                          left: 0,
                          right: 0,
                          textAlign: 'center',
                          zindex: 9,
                          width: 550,
                          height: 400,
                        }}
                      />
                      {/* NEW STUFF */}
                      {emoji !== null ? (
                          <Typography variant="h5" component="h2" style={{ backgroundColor: 'black', color: '#fff' }}>{emoji}</Typography>
                      ) : (
                        ''
                      )}
                  </Grid>
              </Paper>
              )}
              {callAccepted && !callEnded && (
              <Paper className={classes.paper}>
                  <Grid item xs={12} md={6}>
                      <Typography variant="h5" gutterBottom>{call.name || 'Name'}</Typography>
                      <video playsInline ref={userVideo} autoPlay className={classes.video} />
                      {message !== null ? (
                          <Typography variant="h5" component="h2" style={{ backgroundColor: 'black', color: '#fff' }}>{message}</Typography>
                      ) : (
                        ''
                      )}
                  </Grid>
              </Paper>
              )}
          </Grid>
      </>
  );
};

export default VideoPlayer;
