"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
const env_1 = require("./config/env");
const redis_config_1 = require("./config/redis.config");
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uri = env_1.envVars.DB_URL;
        yield mongoose_1.default.connect(uri);
        console.log("MongoDB is connected!!");
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log(`Server is listening on port ${env_1.envVars.PORT}`);
        });
    }
    catch (error) {
        console.log("Server error is ", error);
    }
});
// Jokhon jokhon server run hobe tokhon seedSuperAdmin function tao call hobe. Tobe ensure korte hobe server start hower pore seedSuperAdmin call hobe. Tai async await use koreci. Jotokkhon na porjonto server start hobena. totokkhon porjonto next line a jabena. Ar ai 2ta method ke IIFE function er moddhe rakhe, automatic call koreci.
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_config_1.connectRedis)(); // config> redis.config.ts file a otp send er jonno redis ke configure kore server start hower somoi connect korte hobe.
    yield startServer();
    yield (0, seedSuperAdmin_1.seedSuperAdmin)(); // aikhane seedSuperAdmin function er kaj holo. Jodi DB te super admin na thake. Tahole akta super admin create korbe. Ar jodi already exist thake. Tahole ar superAdmin create korbena.
}))();
// Unhandeld rejection error
process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection detected. Server is shutting down .. error is ", err);
    // Aikhane check kortesi, server on thakle 1st a server ke close korbe, then process ke exit korbe.
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    // Uporer condition match na korle server already off ase, akhon sudho process ke exit korlei hobe.
    process.exit(1);
});
// For checking purpush this error through
// Promise.reject(new Error("I forgot to catch this promise"));
// Uncaught exception error
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected. Server is shutting down .. error is ", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// Through a error for checking purpose
// throw new Error("I forgot to handle this local error!");
// Signal termination error or sigterm  --> Aita jokhon server er owner. Ex: AWS, Verce, Render, Railway server er owner tader server ke terminate korbe or stop rakhbe, tokhon ai error handler kaj korbe.
process.on("SIGTERM", () => {
    // Perameter a error asbena.
    console.log("Sigterm Signal recived. Server is shutting down.... ");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// Signal termination error or sigterm  --> Sigterm error handler er moto jokhon amader website deploy kora main hoisting server theke off kore diba, tokhon uporer handler exicute hobe. Ar jokhon amra manualy server amader local computer theke off korbo, aitake aro gracefully off korar jonno
process.on("SIGINT", () => {
    // Perameter a error asbena.
    console.log("SIGINT Signal recived. Server is shutting down ... ");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
/**
 * Total 3 type of error in backend server related
 * 1. Unhandeld rejection error --> asynchronous, promise related kono error hoiase, but seitake jodi try catch er maddhome error handle na kori. Tahole take handle korte hobe.
 
 * 2. Uncaught exception error --> Amader code er moddhe syntax or common error gulo hoi. Like variable name declare korini, but oi variable use kortesi. Sei error ke try catch er maddhome handle na korle, last a uncaught exception er maddhome handle korte pari.

 * 3. Signal termination error or sigterm --> Amader ai server side ke amader computer a rakhe, amader computer ke server hisabe use korte parina. Karon amader computer all time on rakha possible noi. And besi load nita parbena. So amra bivinno cloud server a host kore thaki. Like vercel, reailway, render. Tader computer or server a kono technical issue dekha dila, amader server jeno gracefully stop hoi. Seita handle korar jonno signal termination error hand kore thaki.
 */
