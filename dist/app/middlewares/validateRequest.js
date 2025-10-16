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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (zodSchema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // jokhon postman theke form-datar maddhome file and data property er moddhe info gulo send kortesi. Tokhon aikhane req.body er moddhe exact body ke pawa jabena. Tai req.body ke reset korlam req.body.data dia. Ar jeheto form-data theke text akare astece data. Tai string hisabe asce. So sei string data ke JSON.parse() er maddhome json a convert kore nita hobe. Ar jodi req.body.data na thake tar mane aita json akare asce. Tokhon direct zodSchema te check korte pathia dissi.
        if ((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.data) {
            req.body = JSON.parse((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.data);
        }
        // console.log("validation theke", req.body)
        req.body = yield zodSchema.parseAsync(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.validateRequest = validateRequest;
