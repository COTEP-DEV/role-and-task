import AZeroMQ, { ZmqSocket } from '../AZeroMQ.js';
/**
 * Server used when you have Unidirectionnal server (like PULL)
 */
export default abstract class AZeroMQServerLight extends AZeroMQ {
    constructor();
    startServer({ ipServer, portServer, socketType, transport, identityPrefix, }: {
        ipServer?: string;
        portServer?: string;
        socketType?: string;
        transport?: string;
        identityPrefix?: string;
    }): Promise<ZmqSocket>;
    stopServer(): Promise<void>;
    /**
     * Treat messages that comes from clients
     * send them to the listeners
     */
    treatMessageFromClient(): void;
}
