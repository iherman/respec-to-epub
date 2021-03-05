"use strict";
/**
 * ## Cover page
 *
 * Creation of a cover image.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_cover_image = exports.cover_svg = void 0;
const constants = require("./constants");
const utils = require("./utils");
/**
 * The SVG template to be used for the cover image.
 * @hidden
 */
exports.cover_svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 595 842">
    <desc>
        Cover page for the EPUB file. It consists of three items: (1) the title of the publication, (2) the denomination of the W3C Technical Report type (Note, Draft, Recommendation, etc.) and (3) the Large logo of W3C. The three items are stacked vertically and horizontally centered, with the Title on the top the logo in the bottom and the type in the middle.
    </desc>
    <foreignObject style="overflow: visible; text-align: left;" pointer-events="none" y="200" width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: center; justify-content: center">
            <div style="display: inline-block; font-size: 40px; font-family: sans-serif; color: #005A9C; line-height: 1.2; font-weight: bold; font-style: italic; white-space: nowrap; text-align: center">
                %%%TITLE%%%
            </div>
        </div>
    </foreignObject>
    <foreignObject style="overflow: visible; text-align: left;" pointer-events="none" y="400" width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: center; justify-content: center">
            <div style="display: inline-block; font-size: 20px; font-family: sans-serif; color: #005A9C; line-height: 1.3; font-weight: bold; white-space: nowrap; text-align: center; ">
                %%%SUBTITLE%%%
            </div>
        </div>
    </foreignObject>

    <svg x="140" y="700" width="315" height="48" viewBox='0 0 315 48'>
        <desc>
            Large logo of the World Wide Web Consortium (with the short 'W3C' text followed by the 'World Wide Web consortium' spelled out)
        </desc>
        <g shape-rendering='geometricPrecision' text-rendering='geometricPrecision' image-rendering='optimizeQuality'>
                <g id='Foreground'>
                <path d='M28.022,0.339l8.532,29.009l8.532-29.009h0.185h5.993h16.955v2.883l-8.708,15.004 c3.06,0.982,5.374,2.767,6.943,5.356c1.568,2.589,2.354,5.628,2.354,9.119c0,4.316-1.147,7.945-3.442,10.886 C63.07,46.529,60.099,48,56.451,48c-2.746,0-5.139-0.873-7.179-2.618c-2.04-1.745-3.55-4.108-4.531-7.09l4.825-2 c0.707,1.805,1.639,3.227,2.796,4.266c1.157,1.04,2.52,1.559,4.089,1.559c1.647,0,3.041-0.921,4.178-2.765 c1.138-1.843,1.707-4.06,1.707-6.65c0-2.864-0.608-5.08-1.824-6.648c-1.414-1.844-3.63-2.766-6.65-2.766h-2.353v-2.824l8.238-14.24 h-9.945l-0.566,0.963L37.143,48h-0.588l-8.826-29.538L18.902,48h-0.588L4.192,0.339h6.178l8.532,29.009l5.766-19.535l-2.824-9.474 H28.022z' fill='#005A9C'/>
                <path clip-rule='evenodd' d='M99.054,0c-0.819,0-1.553,0.295-2.11,0.861c-0.591,0.599-0.92,1.376-0.92,2.178 c0,0.802,0.313,1.545,0.887,2.127c0.583,0.591,1.334,0.912,2.144,0.912c0.794,0,1.562-0.321,2.162-0.903 c0.574-0.557,0.886-1.3,0.886-2.136c0-0.811-0.321-1.57-0.878-2.136C100.642,0.313,99.882,0,99.054,0z M101.697,3.065 c0,0.701-0.27,1.351-0.768,1.832c-0.523,0.506-1.173,0.776-1.891,0.776c-0.675,0-1.342-0.278-1.841-0.785 C96.699,4.382,96.42,3.732,96.42,3.04s0.287-1.368,0.802-1.891c0.481-0.49,1.131-0.751,1.84-0.751c0.726,0,1.376,0.27,1.883,0.785 C101.436,1.672,101.697,2.33,101.697,3.065z M99.139,1.258h-1.3v3.444h0.65V3.234h0.642l0.701,1.469h0.726l-0.768-1.57 c0.498-0.101,0.785-0.439,0.785-0.929C100.574,1.579,100.101,1.258,99.139,1.258z M99.021,1.68c0.608,0,0.887,0.169,0.887,0.591 c0,0.405-0.279,0.549-0.87,0.549h-0.549V1.68H99.021z' fill-rule='evenodd'/>
            </g>
            <g id='Calque_1'>
                <rect fill-rule='evenodd' height='17.35' width='206.387' clip-rule='evenodd' y='27.316' x='104.421' fill='#005A9C'/>
                <path d='M116.264,38.784c-0.758,1.078-1.617,2.29-3.401,2.29c-1.111,0-2.509-0.724-2.509-2.593 c0-2.576,2.425-5.405,4.749-5.405c1.331,0,1.937,0.741,1.937,1.482c0,0.758-0.421,1.212-1.061,1.212 c-0.455,0-0.96-0.303-0.96-0.876c0-0.471,0.354-0.741,0.354-0.977c0-0.219-0.236-0.286-0.387-0.286 c-1.465,0-2.476,3.536-2.476,4.732c0,1.347,0.741,1.633,1.229,1.633c0.758,0,1.381-0.539,2.054-1.516L116.264,38.784z' fill='#FFFFFF'/>
                <path d='M137.978,35.668c0,2.509-2.088,5.405-4.782,5.405c-1.381,0-2.694-0.893-2.694-2.509   c0-2.593,2.172-5.489,4.833-5.489C135.974,33.075,137.978,33.412,137.978,35.668z M132.505,39.407c0,0.336,0,1.179,0.875,1.179 c1.617,0,2.593-4.681,2.593-5.944c0-0.842-0.37-1.078-0.808-1.078C133.347,33.563,132.505,38.329,132.505,39.407z' fill='#FFFFFF'/>
                <path d='M159.913,38.8c-0.539,0.909-1.33,2.206-2.644,2.206c-0.27,0-1.179,0-1.179-1.095   c0-1.195,1.482-4.883,1.482-5.253c0-0.202-0.202-0.371-0.421-0.371c-0.421,0-2.122,0.842-3.604,6.567h-2.038 c0.859-3.216,1.717-5.995,1.717-6.416c0-0.438-0.455-0.438-0.909-0.438v-0.455c0.371,0,2.038-0.152,3.368-0.455l-1.01,3.132 l0.051,0.034c1.212-1.785,2.122-3.183,3.586-3.183c0.404,0,1.28,0.034,1.28,1.331c0,1.094-1.465,4.664-1.465,5.152   c0,0.151,0.067,0.303,0.252,0.303c0.336,0,0.724-0.606,1.162-1.28L159.913,38.8z' fill='#FFFFFF'/>
                <path d='M178.833,35.668l-0.455-0.034c-0.135-0.842-0.488-2.004-1.482-2.004c-0.893,0-0.893,0.825-0.893,0.909 c0,1.061,2.307,2.543,2.307,4.277c0,1.633-1.448,2.256-2.526,2.256c-0.741,0-1.162-0.337-1.549-0.337 c-0.067,0-0.404,0.051-0.489,0.337h-0.455l0.371-2.795l0.455,0.051c0.252,2.239,1.465,2.239,1.617,2.239 c0.64,0,0.959-0.505,0.959-0.926c0-0.438-0.404-1.111-0.943-1.735c-0.875-1.01-1.347-1.701-1.347-2.728 c0-1.499,1.162-2.105,2.256-2.105c0.842,0,1.044,0.371,1.6,0.371c0.252,0,0.303-0.067,0.471-0.354h0.488L178.833,35.668z' fill='#FFFFFF'/>
                <path d='M200.228,35.668c0,2.509-2.088,5.405-4.782,5.405c-1.381,0-2.694-0.893-2.694-2.509   c0-2.593,2.172-5.489,4.833-5.489C198.224,33.075,200.228,33.412,200.228,35.668z M194.755,39.407c0,0.336,0,1.179,0.875,1.179 c1.617,0,2.593-4.681,2.593-5.944c0-0.842-0.371-1.078-0.809-1.078C195.597,33.563,194.755,38.329,194.755,39.407z' fill='#FFFFFF'/>
                <path d='M214.316,33.547c1.718-0.152,2.24-0.186,3.368-0.472l-0.943,2.998l0.084,0.034   c0.505-1.011,1.499-3.031,2.61-3.031c0.067,0,0.977,0,0.977,1.111c0,0.774-0.471,1.229-0.993,1.229c-0.589,0-0.775-0.64-1.011-0.64 c-0.471,0-1.347,1.684-1.717,2.576c-0.438,1.128-0.606,1.937-1.145,3.503h-2.038c0.893-3.031,1.718-5.86,1.718-6.399 c0-0.421-0.303-0.438-0.91-0.455V33.547z' fill='#FFFFFF'/>
                <path d='M237.782,34.001h-1.398c-0.556,2.054-1.465,5.001-1.465,5.573c0,0.202,0.236,0.253,0.252,0.253 c0.421,0,1.078-0.994,1.297-1.347l0.37,0.236c-0.623,0.977-1.448,2.29-2.761,2.29c-1.212,0-1.212-1.01-1.212-1.128 c0-0.69,0.808-3.216,1.549-5.876h-0.858v-0.589c0.657-0.252,1.936-0.775,3.082-2.56h0.589l-0.656,2.441h1.212V34.001z' fill='#FFFFFF'/>
                <path d='M254.375,38.716c-0.859,1.313-1.566,2.29-2.812,2.29c-0.977,0-1.162-0.724-1.162-1.128 c0-0.741,1.313-4.951,1.313-5.338c0-0.539-0.505-0.556-0.994-0.539v-0.455c0.674-0.051,2.256-0.202,3.402-0.472 c-0.657,2.408-1.684,5.961-1.684,6.5c0,0.168,0.151,0.253,0.252,0.253c0.404,0,0.977-0.842,1.313-1.347L254.375,38.716z M253.634,29.337c0.64,0,1.162,0.522,1.162,1.145c0,0.606-0.505,1.111-1.162,1.111c-0.791,0-1.111-0.707-1.111-1.145 C252.522,30.044,252.876,29.337,253.634,29.337z' fill='#FFFFFF'/>
                <path d='M275.969,38.834c-0.32,0.573-1.263,2.172-2.677,2.172c-0.253,0-1.128,0-1.128-0.943   c0-0.724,0.202-1.297,0.371-1.802l-0.034-0.017c-1.28,1.785-1.987,2.762-3.267,2.762c-1.297,0-1.297-0.926-1.297-1.313 c0-1.162,1.263-4.227,1.263-5.203c0-0.438-0.371-0.455-0.943-0.488v-0.455c1.499-0.067,3.283-0.455,3.519-0.472l-1.583,5.187 c-0.202,0.64-0.253,0.825-0.253,1.128c0,0.32,0.168,0.404,0.387,0.404c0.674,0,1.701-1.6,1.92-2.004 c0.758-1.364,1.145-2.694,1.667-4.496h1.987c-0.336,1.179-1.734,5.708-1.734,6.248c0,0.286,0.168,0.32,0.252,0.32   c0.404,0,1.044-1.01,1.196-1.246L275.969,38.834z' fill='#FFFFFF'/>
                <path d='M290.258,33.547c1.785-0.152,2.206-0.186,3.368-0.455l-1.011,3.132l0.051,0.034   c0.977-1.499,2.071-3.183,3.57-3.183c0.084,0,1.111,0,1.111,1.128c0,0.656-0.236,1.229-0.387,1.616l0.017,0.034 c0.859-1.364,1.853-2.778,3.233-2.778c0.926,0,1.33,0.589,1.33,1.331c0,1.111-1.499,4.546-1.499,5.203 c0,0.202,0.186,0.252,0.287,0.252c0.32,0,0.859-0.842,1.145-1.28l0.37,0.219c-0.521,0.893-1.296,2.206-2.644,2.206 c-0.286,0-1.179,0-1.179-1.095c0-1.229,1.482-4.816,1.482-5.22c0-0.202-0.135-0.388-0.404-0.388c-0.708,0-1.6,1.465-1.87,1.954 c-0.623,1.078-0.858,1.835-1.701,4.597h-2.021c1.297-4.193,1.853-5.675,1.853-6.146c0-0.32-0.202-0.404-0.32-0.404   c-0.118,0-1.987,0.421-3.553,6.551h-2.038c0.96-3.52,1.718-5.86,1.718-6.416c0-0.488-0.657-0.455-0.91-0.438V33.547z' fill='#FFFFFF'/>
                <path d='M124.153,9.354h2.542l-5.777,19.497h-0.26l-3.611-12.074l-3.61,12.074h-0.231l-5.777-19.497h2.542l3.466,11.872 l2.368-8.001l-1.155-3.87h2.542l3.466,11.872L124.153,9.354z'/>
                <path d='M208.393,8.953h2.542l-5.777,19.497h-0.26l-3.611-12.074l-3.61,12.074h-0.231l-5.777-19.497h2.542l3.466,11.872 l2.368-8.001l-1.155-3.871h2.542l3.466,11.872L208.393,8.953z'/>
                <path d='M277.791,8.953h2.542l-5.777,19.497h-0.26l-3.61-12.074l-3.611,12.074h-0.231l-5.777-19.497h2.542l3.466,11.872 l2.369-8.001l-1.156-3.871h2.542l3.466,11.872L277.791,8.953z'/>
                <path d='M282.077,11.208h7.703v2.557h-5.115v3.082h5.115v2.588h-5.115v4.622h5.115v2.558h-7.703V11.208z'/>
                <path d='M294.139,11.208h5.392c2.28,0,4.129,1.849,4.129,4.098c0,1.047-0.339,1.849-0.894,2.557c1.17,0.894,1.91,2.188,1.91,3.882 c0,2.681-2.188,4.869-4.868,4.869c-0.278,0-5.669,0-5.669,0V11.208z M296.727,16.847h2.804c0.863,0,1.541-0.678,1.541-1.541 c0-0.832-0.678-1.541-1.541-1.541c-0.215,0-2.804,0-2.804,0V16.847z M296.727,24.057h3.082c1.263,0,2.311-1.047,2.311-2.311 c0-1.294-1.048-2.311-2.311-2.311c-0.493,0-3.082,0-3.082,0V24.057z'/>
                <path d='M132.783,10.961c3.482,0,5.392,3.574,5.392,7.95s-1.91,7.95-5.392,7.95c-3.451,0-5.392-3.574-5.392-7.95 S129.332,10.961,132.783,10.961z M132.783,24.303c1.479,0,2.681-2.434,2.681-5.392s-1.202-5.393-2.681-5.393 c-1.448,0-2.681,2.435-2.681,5.393S131.334,24.303,132.783,24.303z'/>
                <path d='M153.58,26.614h-3.143l-3.697-5.146c-0.617,0-1.88,0-1.88,0v5.146h-2.588V11.208h4.899c2.804,0,5.115,2.311,5.115,5.146 c0,1.972-1.109,3.698-2.773,4.561L153.58,26.614z M149.729,16.354c0-1.417-1.14-2.588-2.558-2.588c-0.277,0-2.311,0-2.311,0v5.146 h2.311C148.588,18.911,149.729,17.74,149.729,16.354z'/>
                <path d='M159.495,24.057h5.115v2.558h-7.703V11.208h2.588V24.057z'/>
                <path d='M166.403,11.208h3.605c3.821,0,6.933,3.451,6.933,7.703c0,4.252-3.112,7.703-6.933,7.703c-0.339,0-3.605,0-3.605,0V11.208z  M168.991,24.057h1.017c2.25,0,4.098-2.311,4.098-5.146c0-2.835-1.849-5.146-4.098-5.146c-0.401,0-1.017,0-1.017,0V24.057z'/>
                <path d='M221.504,11.208h3.605c3.821,0,6.933,3.451,6.933,7.703c0,4.252-3.112,7.703-6.933,7.703c-0.339,0-3.605,0-3.605,0V11.208z M224.092,24.057h1.017c2.25,0,4.098-2.311,4.098-5.146c0-2.835-1.849-5.146-4.098-5.146c-0.401,0-1.017,0-1.017,0V24.057z'/>
                <path d='M236.139,11.208h7.703v2.557h-5.115v3.082h5.115v2.588h-5.115v4.622h5.115v2.558h-7.703V11.208z'/>
                <rect fill-rule='evenodd' height='15.419' width='2.256' clip-rule='evenodd' y='11.145' x='214.158'/>
                <path d='M92.752,0.07l1.001,6.084l-3.543,6.778c0,0-1.36-2.876-3.62-4.468c-1.904-1.341-3.144-1.632-5.083-1.232 c-2.49,0.513-5.314,3.492-6.547,7.163c-1.475,4.393-1.489,6.519-1.54,8.472c-0.083,3.131,0.411,4.981,0.411,4.981 s-2.15-3.979-2.131-9.808c0.014-4.159,0.667-7.933,2.593-11.655c1.693-3.274,4.21-5.238,6.444-5.469 c2.31-0.239,4.135,0.875,5.545,2.08c1.48,1.265,2.978,4.031,2.978,4.031L92.752,0.07z'/>
                <path d='M93.189,34.499c0,0-1.566,2.798-2.542,3.876c-0.976,1.079-2.721,2.978-4.878,3.928c-2.156,0.95-3.286,1.129-5.417,0.924 c-2.128-0.206-4.107-1.438-4.801-1.951c-0.693-0.514-2.465-2.028-3.466-3.44c-1.001-1.412-2.567-4.236-2.567-4.236 s0.873,2.83,1.418,4.031c0.314,0.691,1.28,2.806,2.651,4.646c1.278,1.717,3.761,4.672,7.535,5.34 c3.774,0.667,6.367-1.027,7.009-1.438c0.642-0.411,1.994-1.542,2.85-2.458c0.894-0.956,1.739-2.176,2.208-2.908 c0.342-0.534,0.898-1.617,0.898-1.617L93.189,34.499z'/>
            </g>
        </g>
    </svg>
</svg>
`;
/**
 * Create the cover image: it is an SVG file with title, the type of the document, date, and a W3C Logo.
 *
 * @param global
 * @returns - resources for containing a single SVG file.
 */
function create_cover_image(global) {
    const title = global.html_element.querySelector('title').textContent;
    const date = global.html_element.querySelector('time.dt-published').textContent;
    const subtitle = global.config.generatedSubtitle.replace(date, '').trim();
    const final_cover = exports.cover_svg
        .replace('%%%TITLE%%%', utils.slice_text(title))
        .replace('%%%SUBTITLE%%%', `W3C ${subtitle}<br/>${date}`);
    return [{
            media_type: constants.media_types.svg,
            relative_url: 'cover_image.svg',
            id: 'cover',
            text_content: final_cover,
            properties: 'cover-image',
        }];
}
exports.create_cover_image = create_cover_image;
//# sourceMappingURL=cover.js.map