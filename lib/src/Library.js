"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var AMaster_js_1 = __importDefault(require("./RoleSystem/Role/RoleMaster/AMaster.js"));
var ASlave_js_1 = __importDefault(require("./RoleSystem/Role/RoleSlave/ASlave.js"));
var Master_js_1 = __importDefault(require("./RoleSystem/Role/RoleMaster/Master.js"));
var Slave_js_1 = __importDefault(require("./RoleSystem/Role/RoleSlave/Slave.js"));
var ARole_js_1 = __importDefault(require("./RoleSystem/Role/ARole.js"));
var RoleAndTask_js_1 = __importDefault(require("./RoleAndTask.js"));
var ATask_js_1 = __importDefault(require("./RoleSystem/Tasks/ATask.js"));
var ALink_js_1 = __importDefault(require("./RoleSystem/Links/ALink.js"));
var AHandler_js_1 = __importDefault(require("./RoleSystem/Handlers/AHandler.js"));
var RoleHandler_js_1 = __importDefault(require("./RoleSystem/Handlers/RoleHandler.js"));
var TaskHandler_js_1 = __importDefault(require("./RoleSystem/Handlers/TaskHandler.js"));
var ZeroMQClientDealer_js_1 = __importDefault(require("./CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Client/Implementations/ZeroMQClientDealer.js"));
var ZeroMQClientPush_js_1 = __importDefault(require("./CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Client/Implementations/ZeroMQClientPush.js"));
var ZeroMQServerRouter_js_1 = __importDefault(require("./CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/Implementations/ZeroMQServerRouter.js"));
var ZeroMQServerPull_js_1 = __importDefault(require("./CommunicationSystem/SocketCommunicationSystem/ZeroMQ/Server/Implementations/ZeroMQServerPull.js"));
var CONSTANT_js_1 = __importDefault(require("./Utils/CONSTANT/CONSTANT.js"));
var Utils_1 = __importDefault(require("./Utils/Utils"));
/**
 * This is what the library user is going to see
 */
exports.default = {
    ASlave: ASlave_js_1.default,
    Slave: Slave_js_1.default,
    Master: Master_js_1.default,
    AMaster: AMaster_js_1.default,
    ARole: ARole_js_1.default,
    ATask: ATask_js_1.default,
    ALink: ALink_js_1.default,
    AHandler: AHandler_js_1.default,
    TaskHandler: TaskHandler_js_1.default,
    RoleHandler: RoleHandler_js_1.default,
    RoleAndTask: RoleAndTask_js_1.default,
    ZeroMQClientDealer: ZeroMQClientDealer_js_1.default,
    ZeroMQServerRouter: ZeroMQServerRouter_js_1.default,
    ZeroMQClientPush: ZeroMQClientPush_js_1.default,
    ZeroMQServerPull: ZeroMQServerPull_js_1.default,
    CONSTANT: CONSTANT_js_1.default,
    parseEqualsArrayOptions: Utils_1.default.parseEqualsArrayOptions,
    extractOptionsFromCommandLineArgs: Utils_1.default.extractOptionsFromCommandLineArgs,
};
