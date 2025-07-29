"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.IsActive = void 0;
// Aikhane extravabe enum likhaci. But isActive property er por or symboll diaw likhte partam. Aivabe likhar benifit holo: pore jodi block property er value restricted set korte hoi. Tokhon sudho aikhane BLOCK = "RESTRICTED"  kore dilai. all jaigai reffer hoia jabe. Abar VS code sujjeciton oo dei.
var IsActive;
(function (IsActive) {
    IsActive["ACTIVE"] = "ACTIVE";
    IsActive["INACTIVE"] = "INACTIVE";
    IsActive["BLOCK"] = "BLOCK";
})(IsActive || (exports.IsActive = IsActive = {}));
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["GUIDE"] = "GUIDE";
})(Role || (exports.Role = Role = {}));
