'use strict';
/*

Browsers support of WebRTC
Desktop:

Chrome (latest)
Firefox (latest)
Opera (latest)
Mobile:

Android Browser (latest)
Opera Mobile (latest)
Chrome for Android (latest)
Firefox for Android (latest)
Unfortunately, these features are unsupported in IE and Safari, and iOS mobile browsers.
You can find more info here - http://iswebrtcreadyyet.com/.

Note: Opera mini for Android, which has minimal functionality, does not work with this technology either.


*/
const RtcSignalServer = 'https://52.172.181.47:8081';
var ZingHRTC = {
	isInitiator:null,
	peerConn:null,
	socketSignal:function(room){

	  // Connect to the signaling server
	  var socket = io.connect(RtcSignalServer);
	  socket.on('ipaddr', function(ipaddr) {
	    console.log('Server IP address is: ' + ipaddr);
	    // updateRoomURL(ipaddr);
	  });

	  socket.on('created', function(room, clientId) {
	    console.log('Created room', room, '- my client ID is', clientId);
	    ZingHRTC.isInitiator = true;
	    // grabWebCamVideo();
	  });

	  socket.on('joined', function(room, clientId) {
	    console.log('This peer has joined room', room, 'with client ID', clientId);
	    ZingHRTC.isInitiator = false;
	    // grabWebCamVideo();
	    ZingHRTC.createPeerConnection(ZingHRTC.isInitiator, ZingHRTC.configuration); 
	  });

	  socket.on('full', function(room) {
	    alert('Room ' + room + ' is full. We will create a new room for you.');
	    window.location.hash = '';
	    window.location.reload();
	  });

	  socket.on('ready', function() {
	    console.log('Socket is ready');
	    // grabWebCamVideo();
	    ZingHRTC.createPeerConnection(ZingHRTC.isInitiator, ZingHRTC.configuration);
	  });

	  socket.on('log', function(array) {
	    console.log.apply(console, array);
	  });

	  socket.on('message', function(message) {
	    console.log('Client received message:', message);
	    ZingHRTC.signalingMessageCallback(message);
	  });
	  // Join a room
	  socket.emit('create or join', room);
	  if (location.hostname.match(/localhost|127\.0\.0/)) {
	    socket.emit('ipaddr');
	  }
	  return socket;
	},
	sendMessage :function(message) {
		  console.log('Client sending message: ', message);
		  this.signalingSocket.emit('message', message);
		},
	signalingSocket:null,
	createRoom : function(userIdArrays,roomName){
		this.signalingSocket = this.socketSignal(roomName);

	},
	
	AllVideoElements:[],
	AllVideoStreams:[],
	AddVideoElements : function(elements){
		ZingHRTC.AllVideoElements = elements;
	},
	selfStream:null,
	session:{
		getUserMedia:function(videoAudioConfig){
			console.log('Getting user media (video) ...');
		  navigator.mediaDevices.getUserMedia({
		    audio: true,
		    video: true
		  }).then(gotStream).catch(function(e) {
		    alert('getUserMedia() error: ' + e.name);
		  });
		  function gotStream(stream){
			ZingHRTC.selfStream = stream;
			ZingHRTC.session.attachMediaStream(ZingHRTC.AllVideoElements);
			};
		    
		},
		attachMediaStream:function(videoStreamMediaElements){
				ZingHRTC.AllVideoElements = videoStreamMediaElements;
				ZingHRTC.AllVideoStreams.push(ZingHRTC.selfStream);
				var streamURL = window.URL.createObjectURL(ZingHRTC.selfStream);
				ZingHRTC.AllVideoElements[0].src = streamURL;
		}
	},
	
	peerConn:null,
	dataChannel:null,
	createPeerConnection:function(isInitiator,config){
			console.log('Creating Peer connection as initiator?', isInitiator);
			ZingHRTC.peerConn = new RTCPeerConnection(config);
			ZingHRTC.peerConn.addStream(ZingHRTC.selfStream);
			// send any ice candidates to the other peer
			this.peerConn.onicecandidate = function(event) {
			console.log('icecandidate event:', event);
				if (event.candidate) {
					ZingHRTC.sendMessage({
						type: 'candidate',
						label: event.candidate.sdpMLineIndex,
						id: event.candidate.sdpMid,
						candidate: event.candidate.candidate
					});
				} else {
					console.log('End of candidates.');
				}
			};

			if (isInitiator) {
				console.log('Creating Data Channel');
				//dataChannel = peerConn.createDataChannel('photos');
				//onDataChannelCreated(dataChannel);
				console.log('Creating an offer');
				ZingHRTC.peerConn.createOffer(ZingHRTC.onLocalSessionCreated, ZingHRTC.logError);
			} else {
			ZingHRTC.peerConn.ondatachannel = function(event) {
				console.log('ondatachannel:', event.channel);
				ZingHRTC.dataChannel = event.channel;
				ZingHRTC.onDataChannelCreated(ZingHRTC.dataChannel);
				
				};
	}

	ZingHRTC.peerConn.onaddstream = ZingHRTC.onRemoteStreamAdded;
	},
	onRemoteStreamAdded : function(event){
		ZingHRTC.AllVideoStreams.push(event.stream);
		ZingHRTC.AllVideoElements[1].src = window.URL.createObjectURL(event.stream);
	},
	signalingMessageCallback:function(message){

		if (message.type === 'offer') {
		    console.log('Got offer. Sending answer to peer.');
		    ZingHRTC.peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {},
		                                  ZingHRTC.logError);
		    ZingHRTC.peerConn.createAnswer(this.onLocalSessionCreated, ZingHRTC.logError);

		  } else if (message.type === 'answer') {
		    console.log('Got answer.');
		    ZingHRTC.peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {},
		                                  ZingHRTC.logError);

		  } else if (message.type === 'candidate') {
		    ZingHRTC.peerConn.addIceCandidate(new RTCIceCandidate({
		      candidate: message.candidate
		    }));

		  } else if (message === 'bye') {
				// TODO: cleanup RTC connection?
		  }
	},
	onLocalSessionCreated :function(desc) {
	  console.log('local session created:', desc);
	  ZingHRTC.peerConn.setLocalDescription(desc, function() {
	    console.log('sending local desc:', ZingHRTC.peerConn.localDescription);
	    ZingHRTC.sendMessage(ZingHRTC.peerConn.localDescription);
	  }, ZingHRTC.logError);
	},

	onDataChannelCreated : function(channel) {
		  console.log('onDataChannelCreated:', channel);

		  channel.onopen = function() {
		    console.log('CHANNEL opened!!!');
		  };

		  //channel.onmessage = (adapter.browserDetails.browser === 'firefox') ?
		  //receiveDataFirefoxFactory() : receiveDataChromeFactory();
	},

	logError : function(err){
  		console.log(err.toString(), err);
	},
	iceServerConfiguration : {
		  'iceServers': [{url:'stun:stun01.sipphone.com'},
						{url:'stun:stun.ekiga.net'},
						{url:'stun:stun.fwdnet.net'},
						{url:'stun:stun.ideasip.com'},
						{url:'stun:stun.iptel.org'},
						{url:'stun:stun.rixtelecom.se'},
						{url:'stun:stun.schlund.de'},
						{url:'stun:stun.l.google.com:19302'},
						{url:'stun:stun1.l.google.com:19302'},
						{url:'stun:stun2.l.google.com:19302'},
						{url:'stun:stun3.l.google.com:19302'},
						{url:'stun:stun4.l.google.com:19302'},
						{url:'stun:stunserver.org'},
						{url:'stun:stun.softjoys.com'},
						{url:'stun:stun.voiparound.com'},
						{url:'stun:stun.voipbuster.com'},
						{url:'stun:stun.voipstunt.com'},
						{url:'stun:stun.voxgratia.org'},
						{url:'stun:stun.xten.com'},
						{
						  url: 'turn:numb.viagenie.ca',
						  credential: 'muazkh',
						  username: 'webrtc@live.com'
						},
						{
						  url: 'turn:192.158.29.39:3478?transport=udp',
						  credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
						  username: '28224511:1379330808'
						},
						{
						  url: 'turn:192.158.29.39:3478?transport=tcp',
						  credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
						  username: '28224511:1379330808'
						}]
					}
};

