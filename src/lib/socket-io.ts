import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

let socketInstance: Socket | null = null;

/**
 * Returns a singleton socket instance, tagged with the given userId
 * so the backend can `socket.join(`user:${userId}`)` on connect.
 */
export const getSocket = (userId: string): Socket => {
    if (!socketInstance) {
        socketInstance = io(SOCKET_URL, {
            query: { userId },
            autoConnect: false,
            transports: ["websocket"],
        });
    } else {
        // Keep the query in sync if userId changes (e.g. re-login as different user)
        socketInstance.io.opts.query = { userId };
    }
    return socketInstance;
};

export const disconnectSocket = () => {
    socketInstance?.disconnect();
    socketInstance = null;
};