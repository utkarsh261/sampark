import React, {
  createContext, useState, useRef, useEffect,
} from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { IP } from './constants';

const SocketContext = createContext();

const socket = io(IP);

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const [videoState, setVideoState] = useState(true);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        // eslint-disable-next-line no-unused-expressions
        myVideo.current ? myVideo.current.srcObject = currentStream : null;
      });

    socket.on('me', (id) => setMe(id));

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({
        isReceivingCall: true, from, name: callerName, signal,
      });
    });
  }, []);
  const videoCamOff = () => {
    console.log('video off', videoState, stream);
    // eslint-disable-next-line no-unused-expressions
    if (videoState) {
      navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      stream.getVideoTracks()[0].stop();
      setVideoState(false);
    } else {
      setVideoState(true);
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          // eslint-disable-next-line no-unused-expressions
          myVideo.current ? myVideo.current.srcObject = currentStream : null;
        });
    }
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: id, signalData: data, from: me, name,
      });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (

      <SocketContext.Provider value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        videoCamOff,
      }}
      >
          {children}
      </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
