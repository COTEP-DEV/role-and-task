"use strict";
//
// Copyright (c) 2019 by Cotep. All Rights Reserved.
//
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
var zmq = __importStar(require("zeromq"));
var CONSTANT_js_1 = __importDefault(require("../../../../Utils/CONSTANT/CONSTANT.js"));
var AZeroMQ_js_1 = __importDefault(require("../AZeroMQ.js"));
var Utils_js_1 = __importDefault(require("../../../../Utils/Utils.js"));
var PromiseCommandPattern_js_1 = __importDefault(require("../../../../Utils/PromiseCommandPattern.js"));
var Errors_js_1 = __importDefault(require("../../../../Utils/Errors.js"));
var RoleAndTask_1 = __importDefault(require("../../../../RoleAndTask"));
var timers_1 = require("timers");
/**
 * Server used when you have Bidirectionnal server ROUTER
 *
 *
 *  We have implemented a custom ping system because the inner ping system doesn't work properly.
 *  In fact, it triggers random event "disconnect". We sould try it later to see if it get corrected
 *
 */
var ZeroMQServerRouter = /** @class */ (function (_super) {
    __extends(ZeroMQServerRouter, _super);
    function ZeroMQServerRouter() {
        var _this = _super.call(this) || this;
        _this.isClosing = false;
        _this.descriptorInfiniteRead = null;
        // Mode we are running in
        _this.mode = CONSTANT_js_1.default.ZERO_MQ.MODE.SERVER;
        // List of server client
        _this.clientList = [];
        // Infos about server options
        _this.infosServer = false;
        // Function to deal with the incoming regular messages
        _this.newConnectionListeningFunction = [];
        _this.newDisconnectionListeningFunction = [];
        return _this;
    }
    /**
     * Get infos from the server -> ip/port ...etc
     */
    ZeroMQServerRouter.prototype.getInfosServer = function () {
        return this.infosServer;
    };
    /**
     * Return the list of connected clients
     * @return {Array}
     */
    ZeroMQServerRouter.prototype.getConnectedClientList = function () {
        return this.clientList.map(function (x) { return x.clientIdentityString; });
    };
    /**
     * Start a ZeroMQ Server
     */
    ZeroMQServerRouter.prototype.start = function (_a) {
        var _this = this;
        var _b = _a.ipServer, ipServer = _b === void 0 ? CONSTANT_js_1.default.ZERO_MQ.DEFAULT_SERVER_IP_ADDRESS : _b, _c = _a.portServer, portServer = _c === void 0 ? CONSTANT_js_1.default.ZERO_MQ.DEFAULT_SERVER_IP_PORT : _c, _d = _a.transport, transport = _d === void 0 ? CONSTANT_js_1.default.ZERO_MQ.TRANSPORT.TCP : _d, _e = _a.identityPrefix, identityPrefix = _e === void 0 ? CONSTANT_js_1.default.ZERO_MQ.SERVER_IDENTITY_PREFIX : _e;
        return PromiseCommandPattern_js_1.default({
            func: function () { return __awaiter(_this, void 0, void 0, function () {
                var err_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // If the server is already up
                            if (this.active)
                                return [2 /*return*/, this.zmqObject];
                            // Create the server socket
                            this.zmqObject = new zmq.Router();
                            this.zmqObject.connectTimeout = CONSTANT_js_1.default.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE;
                            this.zmqObject.heartbeatTimeout = CONSTANT_js_1.default.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE;
                            this.zmqObject.heartbeatInterval = CONSTANT_js_1.default.ZERO_MQ.CLIENT_KEEP_ALIVE_TIME;
                            this.zmqObject.heartbeatTimeToLive = CONSTANT_js_1.default.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE;
                            this.zmqObject.reconnectInterval = -1;
                            this.zmqObject.receiveTimeout = 0;
                            // Set an identity to the server
                            this.zmqObject.routingId = identityPrefix + "_" + process.pid;
                            // Listen to the event we sould not receive :: error handling
                            this.zmqObject.events.on('close', function (data) {
                                // If this is a regular close, do nothing
                                if (_this.isClosing || RoleAndTask_1.default.getInstance().getActualProgramState().id === CONSTANT_js_1.default.DEFAULT_STATES.CLOSE.id) {
                                    return;
                                }
                                console.error("ZeroMQServerRouter :: got event close when it wasn't expected");
                                throw new Errors_js_1.default('E2011', "ZeroMQServerRouter :: RoleAndTask actual state <<" + RoleAndTask_1.default.getInstance().getActualProgramState().name + ">>");
                            });
                            this.zmqObject.events.on('disconnect', function (data) {
                                // If this is a regular close, do nothing
                                if (_this.isClosing || RoleAndTask_1.default.getInstance().getActualProgramState().id === CONSTANT_js_1.default.DEFAULT_STATES.CLOSE.id) {
                                    return;
                                }
                                console.error("ZeroMQServerRouter :: got event disconnect when it wasn't expected");
                                // throw new Errors('E2011', `ZeroMQServerRouter :: ${data.address} :: RoleAndTask actual state <<${RoleAndTask.getInstance().getActualProgramState().name}>>`);
                            });
                            this.zmqObject.events.on('end', function (data) {
                                if (_this.isClosing || RoleAndTask_1.default.getInstance().getActualProgramState().id === CONSTANT_js_1.default.DEFAULT_STATES.CLOSE.id) {
                                    return;
                                }
                                console.error("ZeroMQServerRouter :: got UNWANTED event end");
                                throw new Errors_js_1.default('E2010', 'end');
                            });
                            this.zmqObject.events.on('unknown', function (data) {
                                console.error("ZeroMQServerRouter :: got event unknown");
                            });
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.zmqObject.bind(transport + "://" + ipServer + ":" + portServer)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            // Log something
                            console.error("Server ZeroMQ Bind Failed. Transport=" + transport + " Port=" + portServer + " IP:" + ipServer);
                            // Remove the socket
                            delete this.zmqObject;
                            this.zmqObject = null;
                            this.active = false;
                            // Return an error
                            throw new Errors_js_1.default('E2007', "Specific: " + err_1);
                        case 4:
                            // Start to handle client messages
                            this.treatMessageFromClient();
                            this.infosServer = {
                                ipServer: ipServer,
                                portServer: portServer,
                                transport: transport,
                                identityPrefix: identityPrefix,
                            };
                            this.active = true;
                            // We successfuly bind the server
                            return [2 /*return*/, this.zmqObject];
                    }
                });
            }); },
        });
    };
    /**
     * Stop a ZeroMQ Server
     */
    ZeroMQServerRouter.prototype.stop = function () {
        var _this = this;
        return PromiseCommandPattern_js_1.default({
            func: function () {
                return new Promise(function (resolve, reject) {
                    // If the server is already down
                    if (!_this.active || !_this.zmqObject) {
                        resolve();
                        return;
                    }
                    // When ZeroMQ close, we can have multiple events triggered, such as end/close
                    _this.isClosing = true;
                    _this.zmqObject.events.on('close', function (data) {
                        resolve();
                    });
                    _this.zmqObject.events.on('close:error', function (data) {
                        reject(new Errors_js_1.default('E2010', "close:error :: " + data.error));
                    });
                    _this.zmqObject.events.on('end', function (data) {
                        resolve();
                    });
                    _this.zmqObject.close();
                    _this.zmqObject = null;
                    _this.active = false;
                    // Empty the clientList
                    _this.clientList = [];
                    _this.infosServer = false;
                    if (_this.descriptorInfiniteRead) {
                        timers_1.clearInterval(_this.descriptorInfiniteRead);
                    }
                    _this.descriptorInfiniteRead = null;
                });
            },
        });
    };
    /**
     * Send a message to every connected client
     */
    ZeroMQServerRouter.prototype.sendBroadcastMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(this.clientList.map(function (x) { return _this.sendMessage(x.clientIdentityByte, x.clientIdentityString, message); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Close a connection to a client
     */
    ZeroMQServerRouter.prototype.closeConnectionToClient = function (clientIdentityByte, clientIdentityString) {
        this.sendMessage(clientIdentityByte, clientIdentityString, CONSTANT_js_1.default.ZERO_MQ.SERVER_MESSAGE.CLOSE_ORDER);
        // Remove the client data from the array
        this.removeClientToServer(clientIdentityByte, clientIdentityString);
    };
    /**
     * Disconnect a user because we have got no proof of life from it since too long
     * long defined by CONSTANT.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE
     */
    ZeroMQServerRouter.prototype.disconnectClientDueToTimeoutNoProofOfLive = function (clientIdentityByte, clientIdentityString) {
        // Send a bye message to the client, in case he's coming back
        this.closeConnectionToClient(clientIdentityByte, clientIdentityString);
    };
    /**
     * Handle a new connection of client to the server
     * (Store it into a list that will be useful create clientConnection/clientDisconnection event)
     */
    ZeroMQServerRouter.prototype.handleNewClientToServer = function (clientIdentityByte, clientIdentityString) {
        // We put the client into a list of connected client
        var exist = this.clientList.some(function (x) { return x.clientIdentityString === clientIdentityString; });
        if (!exist) {
            this.clientList.push({
                clientIdentityString: clientIdentityString,
                clientIdentityByte: clientIdentityByte,
                intervalSendAlive: null,
                timeoutReceiveAlive: null,
            });
            this.startPingRoutine(clientIdentityString);
            Utils_js_1.default.fireUp(this.newConnectionListeningFunction, [
                clientIdentityByte,
                clientIdentityString,
            ]);
        }
    };
    /**
     * Send pings to the clients every Xsec
     */
    ZeroMQServerRouter.prototype.startPingRoutine = function (clientIdentityString) {
        var _this = this;
        var client = this.clientList.find(function (x) { return x.clientIdentityString === clientIdentityString; });
        if (!client) {
            return;
        }
        client.intervalSendAlive = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendMessage(new Buffer(''), clientIdentityString, CONSTANT_js_1.default.ZERO_MQ.CLIENT_MESSAGE.ALIVE)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, CONSTANT_js_1.default.ZERO_MQ.CLIENT_KEEP_ALIVE_TIME);
        client.timeoutReceiveAlive = setTimeout(function () {
            _this.handleErrorPingTimeout();
        }, CONSTANT_js_1.default.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE);
    };
    ZeroMQServerRouter.prototype.stopPingRoutine = function (clientIdentityString) {
        var client = this.clientList.find(function (x) { return x.clientIdentityString === clientIdentityString; });
        if (!client) {
            return;
        }
        if (client.intervalSendAlive) {
            timers_1.clearInterval(client.intervalSendAlive);
        }
        if (client.timeoutReceiveAlive) {
            clearTimeout(client.timeoutReceiveAlive);
        }
    };
    ZeroMQServerRouter.prototype.handleErrorPingTimeout = function () {
        throw new Errors_js_1.default('E2009', 'ZeroMQServerRouter');
    };
    /**
     * A ping arrived for the client, update the timeout date
     */
    ZeroMQServerRouter.prototype.handleNewPing = function (clientIdentityString) {
        var _this = this;
        var client = this.clientList.find(function (x) { return x.clientIdentityString === clientIdentityString; });
        if (!client) {
            return;
        }
        if (client.timeoutReceiveAlive) {
            clearTimeout(client.timeoutReceiveAlive);
        }
        client.timeoutReceiveAlive = setTimeout(function () {
            _this.handleErrorPingTimeout();
        }, CONSTANT_js_1.default.ZERO_MQ.TIMEOUT_CLIENT_NO_PROOF_OF_LIVE);
    };
    ZeroMQServerRouter.prototype.sendMessage = function (_, clientIdentityString, message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.zmqObject && this.active)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.zmqObject.send([
                                clientIdentityString,
                                message,
                            ])];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Remove a client from the clientList array
     */
    ZeroMQServerRouter.prototype.removeClientToServer = function (clientIdentityByte, clientIdentityString) {
        this.clientList = this.clientList.filter(function (x) { return x.clientIdentityString !== clientIdentityString; });
        this.stopPingRoutine(clientIdentityString);
        Utils_js_1.default.fireUp(this.newDisconnectionListeningFunction, [
            clientIdentityByte,
            clientIdentityString,
        ]);
    };
    /**
     * Treat messages that comes from clients
     */
    ZeroMQServerRouter.prototype.treatMessageFromClient = function () {
        var _this = this;
        var func = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, clientIdentityByte_1, data, dataString_1, clientIdentityString_1, ret, err_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        if (!this.zmqObject) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.zmqObject.receive()];
                    case 1:
                        _a = _b.sent(), clientIdentityByte_1 = _a[0], data = _a[1];
                        dataString_1 = String(data);
                        clientIdentityString_1 = String(clientIdentityByte_1);
                        ret = [
                            //
                            //
                            // Here we treat special strings
                            //
                            //
                            {
                                keyStr: CONSTANT_js_1.default.ZERO_MQ.CLIENT_MESSAGE.HELLO,
                                func: function () { return _this.handleNewClientToServer(clientIdentityByte_1, clientIdentityString_1); },
                            },
                            {
                                keyStr: CONSTANT_js_1.default.ZERO_MQ.CLIENT_MESSAGE.ALIVE,
                                func: function () { return _this.handleNewPing(clientIdentityString_1); },
                            },
                        ].some(function (x) {
                            if (x.keyStr === dataString_1) {
                                x.func();
                                return true;
                            }
                            return false;
                        });
                        // If the user have a function to deal with incoming messages
                        if (!ret) {
                            Utils_js_1.default.fireUp(this.incomingMessageListeningFunction, [
                                clientIdentityByte_1,
                                clientIdentityString_1,
                                dataString_1,
                            ]);
                        }
                        _b.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        err_2 = _b.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        if (this.descriptorInfiniteRead) {
                            clearTimeout(this.descriptorInfiniteRead);
                        }
                        this.descriptorInfiniteRead = setTimeout(func, CONSTANT_js_1.default.ZERO_MQ.WAITING_TIME_BETWEEN_TWO_RECEIVE);
                        return [2 /*return*/];
                }
            });
        }); };
        this.descriptorInfiniteRead = setTimeout(func, CONSTANT_js_1.default.ZERO_MQ.WAITING_TIME_BETWEEN_TWO_RECEIVE);
    };
    /**
     * Push the function that will get when a new connection is detected
     */
    ZeroMQServerRouter.prototype.listenClientConnectionEvent = function (func, context) {
        this.newConnectionListeningFunction.push({
            func: func,
            context: context,
        });
    };
    /**
     * Push the function that will get when a disconnection is detected
     */
    ZeroMQServerRouter.prototype.listenClientDisconnectionEvent = function (func, context) {
        this.newDisconnectionListeningFunction.push({
            func: func,
            context: context,
        });
    };
    return ZeroMQServerRouter;
}(AZeroMQ_js_1.default));
exports.default = ZeroMQServerRouter;