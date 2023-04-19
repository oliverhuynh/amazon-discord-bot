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
exports.__esModule = true;
exports.loopAmazonCategories = exports.scrapeCategories = exports.cache_init = exports.cache_get = exports.cache_set = void 0;
var searchSingleAmazonSite_1 = require("./searchSingleAmazonSite");
require('dotenv').config();
var cacheManager = require('cache-manager');
var fsStore = require('cache-manager-fs-binary');
var cacheDir = './cache';
var cache = false;
var TTL = 30 * 24 * 60 * 60; // 1 month in seconds
var cache_set = function (key, value) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (resolve) { cache.set(key, value, { ttl: TTL }, resolve); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.cache_set = cache_set;
var cache_get = function (key) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.cache_init)()];
            case 1:
                _a.sent();
                return [4 /*yield*/, new Promise(function (resolve) { cache.get(key, function (err, result) { resolve(result); }); })];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.cache_get = cache_get;
var cache_init = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!cache) return [3 /*break*/, 2];
                return [4 /*yield*/, new Promise(function (resolve) {
                        cache = cacheManager.caching({
                            store: fsStore,
                            options: {
                                path: cacheDir,
                                ttl: TTL,
                                preventfill: false,
                                fillcallback: resolve
                            }
                        });
                    })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/, cache];
        }
    });
}); };
exports.cache_init = cache_init;
var scrapeCategories = function (url, page, domain) { return __awaiter(void 0, void 0, void 0, function () {
    var key, cachedResult, categoryLinks;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = "scrape-cats-".concat(url);
                return [4 /*yield*/, (0, exports.cache_get)(key)];
            case 1:
                cachedResult = _a.sent();
                if (cachedResult) {
                    console.log("Using cached categories for ".concat(url));
                    return [2 /*return*/, cachedResult];
                }
                console.log("Surfing categories for ".concat(url));
                return [4 /*yield*/, page.goto(url)];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.waitForSelector('.apb-browse-left-nav', { timeout: 5000 })["catch"](function () { })];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.$$eval('.apb-browse-left-nav a', function (links) { return links.map(function (link) { return link.getAttribute('href'); }).filter(function (href) { return href === null || href === void 0 ? void 0 : href.startsWith('/s?'); }); })];
            case 4:
                categoryLinks = _a.sent();
                categoryLinks = categoryLinks.map(function (href) { return "https://".concat(domain).concat(href); });
                // Cache the result for the given URL
                return [4 /*yield*/, (0, exports.cache_set)(key, categoryLinks)];
            case 5:
                // Cache the result for the given URL
                _a.sent();
                return [2 /*return*/, categoryLinks];
        }
    });
}); };
exports.scrapeCategories = scrapeCategories;
var loopAmazonCategories = function (domain) { return __awaiter(void 0, void 0, void 0, function () {
    var url, key, cachedResult, cats, _a, page, browser, categories, pag1, _i, cats_1, maincat, subcats;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                url = "https://".concat(domain);
                key = "loop-cats-".concat(url);
                return [4 /*yield*/, (0, exports.cache_get)(key)];
            case 1:
                cachedResult = _b.sent();
                if (!!cachedResult) return [3 /*break*/, 14];
                return [4 /*yield*/, (0, searchSingleAmazonSite_1.openpage)(url, { headless: false })];
            case 2:
                _a = _b.sent(), page = _a[0], browser = _a[1];
                // Wait for the "Departments" menu to appear
                return [4 /*yield*/, page.waitForSelector('#nav-hamburger-menu')];
            case 3:
                // Wait for the "Departments" menu to appear
                _b.sent();
                return [4 /*yield*/, page.waitForTimeout(2000)];
            case 4:
                _b.sent(); // wait for 2 seconds for the menu to appear
                // Click on the "Departments" menu to open it
                return [4 /*yield*/, page.click('#nav-hamburger-menu')];
            case 5:
                // Click on the "Departments" menu to open it
                _b.sent();
                return [4 /*yield*/, page.waitForTimeout(4000)];
            case 6:
                _b.sent(); // wait for 4 seconds for the menu to appear
                // Wait for the subcategories to appear
                return [4 /*yield*/, page.waitForSelector('#hmenu-content > ul > li > a')];
            case 7:
                // Wait for the subcategories to appear
                _b.sent();
                if (!(domain.indexOf('amazon.com') === -1)) return [3 /*break*/, 9];
                return [4 /*yield*/, page.$$eval('#hmenu-content > ul > li a[href*="gp/browse.html"]', function (links) {
                        return links.map(function (link) { return link.href; });
                    })];
            case 8:
                cats = _b.sent();
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, page.$$eval('#hmenu-content > ul > li a[href*="/s?"]', function (links) {
                    return links.map(function (link) { return link.href; });
                })];
            case 10:
                // Retrieve the href of each subcategory
                cats = _b.sent();
                _b.label = 11;
            case 11: return [4 /*yield*/, browser.close()];
            case 12:
                _b.sent();
                return [4 /*yield*/, (0, exports.cache_set)(key, cats)];
            case 13:
                _b.sent();
                console.log("Update cached categories for ".concat(url), cats.length);
                return [3 /*break*/, 15];
            case 14:
                cats = cachedResult;
                console.log("Using cached categories for ".concat(url), cats);
                _b.label = 15;
            case 15:
                categories = [];
                if (!(domain.indexOf('amazon.fr') !== -1)) return [3 /*break*/, 22];
                return [4 /*yield*/, (0, searchSingleAmazonSite_1.openpage)("https://".concat(domain))];
            case 16:
                pag1 = _b.sent();
                _i = 0, cats_1 = cats;
                _b.label = 17;
            case 17:
                if (!(_i < cats_1.length)) return [3 /*break*/, 20];
                maincat = cats_1[_i];
                return [4 /*yield*/, (0, exports.scrapeCategories)("".concat(maincat), pag1[0], domain)];
            case 18:
                subcats = _b.sent();
                categories = categories.concat(subcats);
                _b.label = 19;
            case 19:
                _i++;
                return [3 /*break*/, 17];
            case 20: return [4 /*yield*/, pag1[1].close()];
            case 21:
                _b.sent();
                return [3 /*break*/, 23];
            case 22:
                categories = categories.concat(cats);
                _b.label = 23;
            case 23: return [2 /*return*/, categories];
        }
    });
}); };
exports.loopAmazonCategories = loopAmazonCategories;
