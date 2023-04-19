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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.scrapeAmazonSearch = exports.notify = void 0;
var sendDiscordNotification_1 = require("./sendDiscordNotification");
var searchSingleAmazonSite_1 = require("./searchSingleAmazonSite");
var loopAmazonCategories_1 = require("./loopAmazonCategories");
var listAmazonCategoryProducts_1 = require("./listAmazonCategoryProducts");
require('dotenv').config();
var fs = require("fs");
var MAX_DISCOUNT = parseFloat(process.env.MAX_DISCOUNT);
var loggedProductsFilePath = './db/loggedProducts.json';
var loggedProducts = [];
try {
    var fileData = fs.readFileSync(loggedProductsFilePath, 'utf-8');
    loggedProducts = JSON.parse(fileData);
}
catch (error) {
    console.error(error);
}
var notify = function (products) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, products_1, product, title, discountRaw, link, image, originalPrice, price, discount, notification, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _i = 0, products_1 = products;
                _a.label = 1;
            case 1:
                if (!(_i < products_1.length)) return [3 /*break*/, 4];
                product = products_1[_i];
                title = product.title, discountRaw = product.discountRaw, link = product.link, image = product.image, originalPrice = product.originalPrice, price = product.price, discount = product.discount;
                if (!(discountRaw > MAX_DISCOUNT && !loggedProducts.includes(link))) return [3 /*break*/, 3];
                loggedProducts.push(link);
                fs.writeFileSync(loggedProductsFilePath, JSON.stringify(loggedProducts), 'utf-8');
                notification = {
                    username: 'Amazon Scraper Bot',
                    avatarUrl: 'https://i.imgur.com/wSTFkRM.png',
                    product: product
                };
                return [4 /*yield*/, (0, sendDiscordNotification_1.sendDiscordNotification)(notification)];
            case 2:
                result = _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.notify = notify;
var scrapeAmazonSearch = function (keyword, domains) {
    if (domains === void 0) { domains = ['amazon.com', 'amazon.es', 'amazon.fr']; }
    return __awaiter(void 0, void 0, void 0, function () {
        var products, _i, domains_1, domain, categories, _loop_1, _a, categories_1, category, _b, domains_2, domain, results, uniqueProducts;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    products = [];
                    if (!(keyword === "")) return [3 /*break*/, 8];
                    _i = 0, domains_1 = domains;
                    _c.label = 1;
                case 1:
                    if (!(_i < domains_1.length)) return [3 /*break*/, 7];
                    domain = domains_1[_i];
                    return [4 /*yield*/, (0, loopAmazonCategories_1.loopAmazonCategories)(domain)];
                case 2:
                    categories = _c.sent();
                    _loop_1 = function (category) {
                        var results, waitTime;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    console.log("Searching products of ".concat(category));
                                    return [4 /*yield*/, (0, listAmazonCategoryProducts_1.listAmazonCategoryProducts)(category)];
                                case 1:
                                    results = _d.sent();
                                    console.log(["Result products of ".concat(category), results.length]);
                                    (0, exports.notify)(results);
                                    products = __spreadArray(__spreadArray([], products, true), results, true);
                                    waitTime = Math.floor(Math.random() * 5000) + 2000;
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, waitTime); })];
                                case 2:
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a = 0, categories_1 = categories;
                    _c.label = 3;
                case 3:
                    if (!(_a < categories_1.length)) return [3 /*break*/, 6];
                    category = categories_1[_a];
                    return [5 /*yield**/, _loop_1(category)];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    _a++;
                    return [3 /*break*/, 3];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [3 /*break*/, 12];
                case 8:
                    _b = 0, domains_2 = domains;
                    _c.label = 9;
                case 9:
                    if (!(_b < domains_2.length)) return [3 /*break*/, 12];
                    domain = domains_2[_b];
                    return [4 /*yield*/, (0, searchSingleAmazonSite_1.searchSingleAmazonSite)(keyword, domain)];
                case 10:
                    results = _c.sent();
                    (0, exports.notify)(results);
                    products = __spreadArray(__spreadArray([], products, true), results, true);
                    _c.label = 11;
                case 11:
                    _b++;
                    return [3 /*break*/, 9];
                case 12:
                    uniqueProducts = products.reduce(function (acc, curr) {
                        var duplicated = acc.some(function (product) { return product.link === curr.link; });
                        if (!duplicated) {
                            acc.push(curr);
                        }
                        return acc;
                    }, []);
                    return [2 /*return*/, uniqueProducts];
            }
        });
    });
};
exports.scrapeAmazonSearch = scrapeAmazonSearch;
