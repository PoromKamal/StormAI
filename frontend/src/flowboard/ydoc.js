import { Doc } from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

const ydoc = new Doc();
new WebrtcProvider('yjs-flowboard', ydoc, { signaling: ['ws://localhost:1234'] });

export default ydoc;