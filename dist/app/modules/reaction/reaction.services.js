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
exports.ReactionServices = void 0;
const reaction_model_1 = require("./reaction.model");
const createReaction = (paylaod) => __awaiter(void 0, void 0, void 0, function* () {
    const reaction = yield reaction_model_1.Reaction.create(paylaod);
    return reaction;
});
const allReactionWithBlogId = (blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const reaction = yield reaction_model_1.Reaction.find({ blogId });
    return reaction;
});
exports.ReactionServices = { createReaction, allReactionWithBlogId };
