/**
 * ## Interface to the server conversion
 *
 * Bridge between the HTML form and the conversion server. It relies on `<input>` elements with the `id` values set to
 * `url`, `respec`, `publishDate`, `specStatus`, `addSectionLinks`, and `maxTocLevel`.
 *
 * The script relies on the service running at 'https://r2epub.herokuapp.com/'
 *
 * This script must be converted to Javascript.
 *
 *
 * @packageDocumentation
*/
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
var _this = this;
/**
 *
 *
 */
var service = 'https://r2epub.herokuapp.com/';
/**
 * Get the service to perform the conversion.
 *
 * @async
 * @param resource_url The _full_ URL of the service performing the conversion (including the right query parameters)
 * @returns the final content as well as the local name of the EPUB instance
 */
function fetch_book(resource_url) {
    return __awaiter(this, void 0, void 0, function () {
        var fname;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    try {
                        window.fetch(resource_url)
                            .then(function (response) {
                            if (response.ok) {
                                fname = response.headers.get('Content-Disposition').split(';')[1].split('=')[1];
                                return response.blob();
                            }
                            else {
                                reject(new Error("HTTP response " + response.status + ": " + response.statusText + " on " + resource_url));
                            }
                        })
                            .then((function (content) {
                            resolve({
                                file_name: fname,
                                content: content
                            });
                        }))["catch"](function (err) {
                            reject(new Error("Problem accessing " + resource_url + ": " + err));
                        });
                    }
                    catch (err) {
                        reject(err);
                    }
                })];
        });
    });
}
/**
 *
 * Generate the EPUB file. This is a wrapper around [[create_epub]], creating the necessary arguments [[Arguments]] structure based on the incoming form data.
 * The result is saved on the local disc, using the short name of the document.
 *
 * The method is set as an even handler for a submit button. The `event` argument is only used to prevent the default behavior of the button (i.e., to avoid reloading the page).
 *
 * @param event - Event object as forwarded to an HTML event handler.
 *
 * @async
 */
var submit = function (event) { return __awaiter(_this, void 0, void 0, function () {
    var save_book, fading_success, done, progress, url, respec, publishDate, specStatus, addSectionLinks, maxTocLevel, query, service_url, returned, e_1, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                save_book = function (data, name) {
                    var dataURL = URL.createObjectURL(data);
                    var download = document.getElementById('download');
                    download.href = dataURL;
                    download.download = name;
                    download.click();
                };
                fading_success = function () {
                    done.style.setProperty('visibility', 'visible');
                    setTimeout(function () { return done.style.setProperty('visibility', 'hidden'); }, 3000);
                };
                // This is to allow for async to work properly and avoid reloading the page
                event.preventDefault();
                done = document.getElementById('done');
                progress = document.getElementById('progress');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                url = document.getElementById('url');
                respec = document.getElementById('respec');
                publishDate = document.getElementById('publishDate');
                specStatus = document.getElementById('specStatus');
                addSectionLinks = document.getElementById('addSectionLinks');
                maxTocLevel = document.getElementById('maxTocLevel');
                if (!!(url.value === null || url.value === '')) return [3 /*break*/, 6];
                query = [
                    "url=" + url.value,
                    "respec=" + (respec.value === 'true')
                ];
                if (publishDate.value !== '') {
                    query.push("publishDate=" + publishDate.value);
                }
                if (specStatus.value !== "null") {
                    query.push("specStatus=" + specStatus.value);
                }
                if (addSectionLinks.value !== "null") {
                    query.push("addSectionLinks=" + addSectionLinks.value);
                }
                if (maxTocLevel.value !== '') {
                    query.push("maxTocLevel=" + maxTocLevel.value);
                }
                service_url = service + "?" + query.join('&');
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                // turn on the progress bar at the bottom of the form
                progress.style.setProperty('visibility', 'visible');
                return [4 /*yield*/, fetch_book(service_url)];
            case 3:
                returned = _a.sent();
                // // Fetch on service_url!!!!
                // const conversion_process   = new convert.RespecToEPUB(false, false);
                // const the_ocf :ocf.OCF     = await conversion_process.create_epub(args);
                // const content :Blob        = await the_ocf.get_content() as Blob;
                // Save the Blob in  a file
                save_book(returned.content, returned.file_name);
                // Remove the query string from the URL bar
                document.location.search = '';
                // Clean up the user interface and we are done!
                progress.style.setProperty('visibility', 'hidden');
                fading_success();
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                progress.style.setProperty('visibility', 'hidden');
                alert("EPUB Generation Error: " + e_1);
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6:
                alert("No or empty URL value");
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                e_2 = _a.sent();
                alert("Form interpretation Error... " + e_2);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
window.addEventListener('load', function () {
    var submit_button = document.getElementById('submit');
    submit_button.addEventListener('click', submit);
});
