import { useState, useEffect } from 'react';
import { Doc } from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

const useYjs = (roomName) => {
	const [doc, setDoc] = useState(null);

	const createRoom = () => {
		const ydoc = new Doc();
		const provider = new WebrtcProvider(roomName, ydoc);
		setDoc(ydoc);
	};

	useEffect(() => {
		if (!doc) {
			createRoom();
		}
	}, [doc, roomName]);

	return [doc, createRoom];
};

export default useYjs;