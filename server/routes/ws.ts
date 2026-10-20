import { defineWebSocketHandler } from "#imports";

export default defineWebSocketHandler({
  open(peer) {
    console.log(`[WS] Connection opened: ${peer.id}`);
  },
  message(peer, message) {
    try {
      const msgText = message.text();
      const data = JSON.parse(msgText);

      if (data.type === "register" && (data.code || data.userId)) {
        const key = String(data.code || data.userId);

        const context = (peer as any).context;
        if (context) {
          context.regKey = key;
        } else {
          (peer as any).regKey = key;
        }

        if (!(global as any).__wsPeers) {
          (global as any).__wsPeers = new Map();
        }

        const wsPeers = (global as any).__wsPeers;
        let peers = wsPeers.get(key);
        if (!peers) {
          peers = new Set();
          wsPeers.set(key, peers);
        }
        peers.add(peer);
        console.log(`[WS] Registered peer ${peer.id} for key: ${key}`);
      }
    } catch (err) {
      console.error("[WS] Error processing message:", err);
    }
  },
  close(peer, details) {
    console.log(`[WS] Connection closed: ${peer.id}`, details);
    const context = (peer as any).context;
    const key = context ? context.regKey : (peer as any).regKey;
    if (key && (global as any).__wsPeers) {
      const wsPeers = (global as any).__wsPeers;
      const peers = wsPeers.get(key);
      if (peers) {
        peers.delete(peer);
        if (peers.size === 0) {
          wsPeers.delete(key);
        }
        console.log(`[WS] Unregistered peer ${peer.id} for key: ${key}`);
      }
    }
  },
  error(peer, error) {
    console.error(`[WS] Error on peer ${peer.id}:`, error);
  }
});
