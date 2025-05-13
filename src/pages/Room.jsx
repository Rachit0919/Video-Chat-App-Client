// import React, { useEffect, useCallback,useState } from 'react'
// import ReactPlayer from 'react-player'
// import { useSocket } from '../providers/Socket'
// import { usePeer } from '../providers/Peer';

// import {useParams} from 'react-router-dom'



// function RoomPage() {

//     const {socket}  = useSocket();
//     const {peer, createOffer, createAnswer, setRemoteAns, sendStream,remoteStream} = usePeer();

//     const [myStream, setMyStream] = useState(null);
    
//     const [remoteEmailId, setRemoteEmailId] = useState();
    

//     const handleNewUserJoined = useCallback(async (data) =>{
//         const {emailId} = data;
//         console.log("New user joined room", emailId);
//         const offer = await createOffer();
//         socket.emit('call-user', {emailId, offer})
//         setRemoteEmailId(emailId)
//     },[createOffer, socket])

//     const handleIncomingCall = useCallback(async(data) =>{
//         const {from,offer} = data;
//         console.log("incoming Call from", from, offer);
//         const ans = await createAnswer(offer)
//         socket.emit('call-accepted', {emailId: from, ans})
//         setRemoteEmailId(from);

//     },[ createAnswer,socket])

//     const handleCallAccepted = useCallback(async(data) =>{
//         const {ans} = data;
//         console.log("Call got Accepted", ans);
//         await setRemoteAns(ans)
//         sendStream(myStream)
        
//     },[myStream, sendStream, setRemoteAns])


//     const getUserMediaStream  = useCallback(async() =>{
//         const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
        
//         setMyStream(stream)
//     },[])

//     const handleNegotitation = useCallback(() =>{
//         const localOffer = peer.localDescription;
//             socket.emit("call-user",{emailId: remoteEmailId, offer: localOffer  })
//         },[peer.localDescription, remoteEmailId, socket])

//     useEffect(() => {
//         socket.on('user-joined', handleNewUserJoined)
//         socket.on('incoming-call', handleIncomingCall)
//         socket.on('call-accepted', handleCallAccepted)

        
        
//         return () =>{
//             socket.off('user-joined', handleNewUserJoined)
//             socket.off('incoming-call', handleIncomingCall)
//             socket.off('call-accepted', handleCallAccepted)
//         }
//     },[socket, handleNewUserJoined, handleCallAccepted, handleIncomingCall])

//     useEffect(() =>{
//         peer.addEventListener('negotiation-needed',handleNegotitation)
//         return () =>{
//             peer.removeEventListener('negotiation-needed',handleNegotitation)
//         }
//     },[handleNegotitation, peer])

//     useEffect(() =>{
//         getUserMediaStream();
//     },[getUserMediaStream])

//     return (
//         <div className="room-page-container">
//             <h1>Room Page</h1>
//             <h4>You are connected to {remoteEmailId}</h4>
//             <button onClick={e => sendStream(myStream)} >Send My Video</button>
//             <ReactPlayer url={myStream} playing />
//             <ReactPlayer url={remoteStream} playing />
//         </div>
//     )

// }

// export default RoomPage
 
import React, { useEffect, useCallback, useState } from 'react';
import ReactPlayer from 'react-player';
import { useSocket } from '../providers/Socket';
import { usePeer } from '../providers/Peer';
import { useParams } from 'react-router-dom';

function RoomPage() {
    const { socket } = useSocket();
    const { peer, createOffer, createAnswer, setRemoteAns, sendStream, remoteStream } = usePeer();
    const [myStream, setMyStream] = useState(null);
    const [remoteEmailId, setRemoteEmailId] = useState();

    const handleNewUserJoined = useCallback(async (data) => {
        const { emailId } = data;
        console.log("New user joined room", emailId);
        const offer = await createOffer();
        socket.emit('call-user', { emailId, offer });
        setRemoteEmailId(emailId);
    }, [createOffer, socket]);

    const handleIncomingCall = useCallback(async (data) => {
        const { from, offer } = data;
        console.log("Incoming call from", from, offer);
        const ans = await createAnswer(offer);
        socket.emit('call-accepted', { emailId: from, ans });
        setRemoteEmailId(from);
    }, [createAnswer, socket]);

    const handleCallAccepted = useCallback(async (data) => {
        const { ans } = data;
        console.log("Call got accepted", ans);
        await setRemoteAns(ans);
        if (myStream) sendStream(myStream);
    }, [myStream, sendStream, setRemoteAns]);

    const getUserMediaStream = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMyStream(stream);
    }, []);

    const handleNegotitation = useCallback(() => {
        const localOffer = peer.localDescription;
        socket.emit('call-user', { emailId: remoteEmailId, offer: localOffer });
    }, [peer.localDescription, remoteEmailId, socket]);

    useEffect(() => {
        socket.on('user-joined', handleNewUserJoined);
        socket.on('incoming-call', handleIncomingCall);
        socket.on('call-accepted', handleCallAccepted);

        return () => {
            socket.off('user-joined', handleNewUserJoined);
            socket.off('incoming-call', handleIncomingCall);
            socket.off('call-accepted', handleCallAccepted);
        };
    }, [socket, handleNewUserJoined, handleCallAccepted, handleIncomingCall]);

    useEffect(() => {
        peer.addEventListener('negotiationneeded', handleNegotitation);
        return () => {
            peer.removeEventListener('negotiationneeded', handleNegotitation);
        };
    }, [handleNegotitation, peer]);

    useEffect(() => {
        getUserMediaStream();
    }, [getUserMediaStream]);

    return (
        <div className="room-page-container">
            <h1>Room Page</h1>
            <h4>You are connected to {remoteEmailId}</h4>
            <button onClick={e => myStream && sendStream(myStream)}>Send My Video</button>
            <ReactPlayer url={myStream ? URL.createObjectURL(myStream) : null} playing />
            <ReactPlayer url={remoteStream ? URL.createObjectURL(remoteStream) : null} playing />
        </div>
    );
}

export default RoomPage;
