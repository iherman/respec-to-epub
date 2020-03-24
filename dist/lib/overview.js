"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ## Generate the `Overview.xhtml` entry
 *
 * Generation involves two different steps:
 *
 * 1. The package entry for `Overview.xhtml` may contain a `properties` attribute; see [manifest item properties](https://www.w3.org/publishing/epub32/epub-packages.html#app-item-properties-vocab) for further details.
 * 2. Due to the rigidity of the iBook reader, the DOM tree has to change: all children of the `<body>` should be encapsulated into a top level block
 * element (we use `<div role="main">`). This is because iBook imposes a zero padding on the body element, and that cannot be controlled by the user;
 * the introduction of the top level block element allows for suitable CSS adjustments in the [common css file](https://www.w3.org/People/Ivan/TR_EPUB/base.css).
 *
 *
 * @packageDocumentation
*/
const urlHandler = __importStar(require("url"));
const xhtml = __importStar(require("./xhtml"));
const fetch_1 = require("./fetch");
/**
 * Generate the resource entry for the `Overview.xhtml` item into the package; that includes setting the various manifest item
 * properties (see [manifest item properties](https://www.w3.org/publishing/epub32/epub-packages.html#app-item-properties-vocab)).
 *
 * The following properties are set, if applicable:
 *
 * - [mathml](https://www.w3.org/publishing/epub32/epub-packages.html#sec-mathml): there is an explicit usage of mathml.
 * - [scripted](https://www.w3.org/publishing/epub32/epub-packages.html#sec-scripted): there are active scripts.
 * - [svg](https://www.w3.org/publishing/epub32/epub-packages.html#sec-svg): there is explicit svg usage.
 * - [remote-resources](https://www.w3.org/publishing/epub32/epub-packages.html#sec-remote-resources): there are remote resources, typically video, audio, or images.
 *
 * The function also modifies the DOM tree by introducing a `<main>` element right as a child of `body`
 *
 * @param global
 * @return - a single element array with the resource definition of the `Overview.xhtml` entry
 */
function generate_overview_item(global) {
    const properties = [];
    //------------ Setting the properties for the relevant OPF entry
    // 1. Mathml usage
    if (global.html_element.querySelector('mathml') !== null) {
        properties.push('mathml');
    }
    {
        // 2a. are there active scripts. Care should be taken that a <script> element may be a data block, that does not count!
        const scripts = Array.from(global.html_element.querySelectorAll('script'));
        const is_there_script = scripts.find((element) => {
            if (element.hasAttribute('type')) {
                const type = element.getAttribute('type');
                return ['application/javascript', 'application/ecmascript', fetch_1.js_media_type, fetch_1.es_media_type].includes(type);
            }
            else {
                return true;
            }
        });
        if (is_there_script) {
            properties.push('scripted');
        }
        else {
            // 2a. check if there is a form element, that also sets a 'scripted' tag
            if (global.html_element.querySelector('form') !== null) {
                properties.push('scripted');
            }
        }
    }
    // 3. explicit svg usage
    if (global.html_element.querySelector('svg') !== null) {
        properties.push('svg');
    }
    // 4. external resources
    {
        const sources = Array.from(global.html_element.querySelectorAll('video, audio, img, source'));
        const is_there_external_resources = sources.find((element) => {
            if (element.hasAttribute('src')) {
                const parsed = urlHandler.parse(element.getAttribute('src'));
                return parsed.protocol !== null && (parsed.host !== null && parsed.host !== 'www.w3.org');
            }
            else {
                return false;
            }
        });
        if (is_there_external_resources) {
            properties.push('remote-resources');
        }
    }
    //------------------ Modify the DOM
    // A new 'main' element must be created
    // All children of the 'body' element must be "re-parented" to the "main"
    const main_element = global.dom.window.document.createElement('div');
    main_element.setAttribute('role', 'main');
    const body = global.html_element.querySelector('body');
    // Trick from MDN...
    while (body.firstChild) {
        main_element.append(body.firstChild.cloneNode(true));
        // The list is LIVE, so it will re-index each call
        body.removeChild(body.firstChild);
    }
    body.append(main_element);
    return [{
            media_type: fetch_1.xhtml_media_type,
            id: 'main',
            relative_url: 'Overview.xhtml',
            text_content: xhtml.convert(global.dom),
            properties: properties.join(' ')
        }];
}
exports.generate_overview_item = generate_overview_item;
//# sourceMappingURL=overview.js.map