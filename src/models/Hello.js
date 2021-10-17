/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
// Import dependencies
import {
  Finger, FingerCurl, FingerDirection, GestureDescription,
} from 'fingerpose';

// Define Gesture Description
export const helloGesture = new GestureDescription('Hello');

// Thumb
helloGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.5);
helloGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.5);
helloGesture.addDirection(Finger.Thumb, FingerDirection.DiangonalUpRight, 0.5);

// Other Fingers
for (const finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  helloGesture.addCurl(finger, FingerCurl.NoCurl, 0.8);
  helloGesture.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.7);
  helloGesture.addDirection(finger, FingerDirection.DiagonalUpRight, 0.7);
}
