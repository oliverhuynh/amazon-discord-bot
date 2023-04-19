"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.searchSingleAmazonSite = exports.exportProduct = exports.openpage = exports.newbrowser = void 0;
var axios_1 = require("axios");
var cheerio = require("cheerio");
var puppeteer_core_1 = require("puppeteer-core");
require('dotenv').config();
var fs = require('fs');
var executablePath = process.env.CHROME_EXECUTABLE_PATH;
var userDataDir = process.env.CHROME_DATA_DIR;
var newbrowser = function (args) {
    if (args === void 0) { args = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var browser, pid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer_core_1["default"].launch(__assign({ userDataDir: userDataDir, executablePath: executablePath, defaultViewport: null }, args))];
                case 1:
                    browser = _a.sent();
                    pid = browser.process().pid;
                    fs.appendFileSync('./tmp/browser_pid.txt', pid + '\n');
                    return [2 /*return*/, browser];
            }
        });
    });
};
exports.newbrowser = newbrowser;
process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
    var pids;
    return __generator(this, function (_a) {
        pids = fs.readFileSync('./tmp/browser_pid.txt', 'utf8').split('\n').filter(Boolean);
        // Kill each PID in the array
        pids.forEach(function (pid) {
            console.log("Killing PID ".concat(pid, "..."));
            process.kill(pid);
        });
        // Clear the contents of the file
        fs.writeFileSync('./tmp/browser_pid.txt', '');
        console.log('All PIDs killed and file cleared.');
        process.exit();
        return [2 /*return*/];
    });
}); });
var openpage = function (url, args) {
    if (args === void 0) { args = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var catched, browser, page, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    catched = 'For information about migrating to our APIs refer to our Marketplace APIs';
                    return [4 /*yield*/, (0, exports.newbrowser)(__assign({ headless: true }, args))];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    return [4 /*yield*/, page.goto(url)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, page.content()];
                case 4:
                    content = _a.sent();
                    if (!(content.indexOf(catched) !== -1)) return [3 /*break*/, 8];
                    return [4 /*yield*/, browser.close()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.newbrowser)({ headless: false })];
                case 6:
                    browser = _a.sent();
                    return [4 /*yield*/, page.goto(url)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [2 /*return*/, [page, browser]];
            }
        });
    });
};
exports.openpage = openpage;
var exportProduct = function ($, element, domain) { return __awaiter(void 0, void 0, void 0, function () {
    var title, productLink, link, image, priceText, originalPriceText, priceMatch, price, originalPriceMatch, originalPrice, discount;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        title = $(element).find('h2').text().trim();
        productLink = $(element).find('a.a-link-normal').attr('href');
        link = "https://".concat(domain).concat(productLink);
        image = (_d = (_a = $(element).find('img').attr('src')) !== null && _a !== void 0 ? _a : (_c = (_b = $(element).find('img').attr('srcset')) === null || _b === void 0 ? void 0 : _b.split(',').pop()) === null || _c === void 0 ? void 0 : _c.split(' ')[0]) !== null && _d !== void 0 ? _d : '';
        priceText = $(element).find('span.a-offscreen').text();
        originalPriceText = $(element).find('span.a-text-price:not(.a-size-base)').text();
        if (priceText) {
            priceMatch = priceText.match(/(\d[\d,]*)\.?\d{0,2}/);
            price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
            originalPriceMatch = originalPriceText.match(/(\d[\d,]*)\.?\d{0,2}/);
            originalPrice = originalPriceMatch ? parseFloat(originalPriceMatch[1].replace(',', '.')) : price;
            discount = (originalPrice - price) / originalPrice * 100;
            return [2 /*return*/, {
                    title: title,
                    image: image,
                    link: link,
                    price: price,
                    originalPrice: originalPrice,
                    discountRaw: discount,
                    discount: discount.toFixed(2)
                }];
        }
        return [2 /*return*/, false];
    });
}); };
exports.exportProduct = exportProduct;
var searchSingleAmazonSite = function (keyword, domain) { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, cookies, cookieHeader, url, response, $, products;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.newbrowser)()];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _a.sent();
                return [4 /*yield*/, page.cookies("https://".concat(domain))];
            case 3:
                cookies = _a.sent();
                return [4 /*yield*/, browser.close()];
            case 4:
                _a.sent();
                cookieHeader = cookies
                    .map(function (cookie) { return "".concat(cookie.name, "=").concat(cookie.value); })
                    .join('; ');
                url = "https://".concat(domain, "/s?k=").concat(keyword);
                return [4 /*yield*/, axios_1["default"].get(url, {
                        headers: {
                            Cookie: cookieHeader,
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36'
                        }
                    })];
            case 5:
                response = _a.sent();
                $ = cheerio.load(response.data.toString());
                products = [];
                $('.s-result-item').each(function (_, element) { return __awaiter(void 0, void 0, void 0, function () {
                    var product;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, exports.exportProduct)($, element, domain)];
                            case 1:
                                product = _a.sent();
                                if (product) {
                                    products.push(product);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/, products];
        }
    });
}); };
exports.searchSingleAmazonSite = searchSingleAmazonSite;
