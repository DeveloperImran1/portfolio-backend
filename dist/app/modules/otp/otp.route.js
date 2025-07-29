"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRoutes = void 0;
const express_1 = require("express");
const otp_controller_1 = require("./otp.controller");
const route = (0, express_1.Router)();
// User website a register korar pore verified false thake. Seitake true korar jonno user jokhon /send route a request korbe, tokhon akta otp create kore redis DB te store korbo and user er email a otp code send korbo.
route.post("/send", otp_controller_1.OTPController.sendOTP);
// User otp ta email a recive korbe, tarpor verify korar jonno sei otp abaar /verify route a hit korbe. Then amra backend theke otp ke cause kore redis theke ager otp nia check korbo. Match hole user er verified status true kore dibo.
route.post("/verify", otp_controller_1.OTPController.verifyOTP);
exports.OtpRoutes = route;
