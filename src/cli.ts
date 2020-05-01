#! /usr/local/bin/node
/**
 * ## CLI to the ReSpec to EPUB 3.2 conversion.
 *
 * The usage of the entry point is:
 *
 * ```
 * Options:
 *  --help                 Show help  [boolean]
 *  -r, --respec           The source is in respec [boolean] [default: false]
 *  -d, --publishDate      Publication date [string] [default: null]
 *  -s, --specStatus       Specification type [string] [default: null]
 *  -l, --addSectionLinks  Add section links with "§" [string] [default: null]
 *  -m, --maxTocLevel      Max TOC level [number] [default: null]
 *  --version              Show version number  [boolean]
 * ```
 *
 * For the `-d`, `-s`, `-l`, or `-m` flags, see the [ReSpec manual](https://www.w3.org/respec/). If any of those flags is set, `-r` is implied (i.e., it is not necessary to set it explicitly).
 *
 * This function is a wrapper around [[create_epub]].
 *
 * ### Usage examples:
 *
 * Convert the HTML file (as generated by ReSpec) to an EPUB 3.2 file. The generated publication's name is `short-name.epub`, where `short-name` is set in the ReSpec configuration:
 *
 * ``` sh
 * node cli.js https://www.example.org/doc.html`
 * ```
 * Convert the HTML _ReSpec source_ to an EPUB 3.2 file. The source is converted on-the-fly by respec:
 *
 * ``` sh
 * node cli.js -r https://www.example.org/index.html`
 * ```
 *
 * Convert the HTML _ReSpec source_ to an EPUB 3.2 file, setting its spec status to REC. The source is converted on-the-fly by respec, overwriting the `specStatus` entry in the configuration to `REC`:
 *
 * ``` sh
 * node cli.js -r --specStatus REC https://www.example.org/index.html`
 * ```
 *
 * @packageDocumentation
 */
/* Main imports */
import * as convert from './lib/convert';
import * as ocf from './lib/ocf';
import * as fs      from 'fs';

/** @hidden */
import yargs = require('yargs')

/**
 * CLI to the ReSpec to EPUB 3.2 conversion.
 *
 * It is a simple interpretation of the command line, a wrapper around [[create_epub]], and the output of the generated content to local directory.
 *
 * @async
 */
async function cli() {
    const argv = yargs.options({
        o: { type: 'string',  alias: 'output',          default: null,  description: 'Output file name. If missing, the short name of the document is used.', },
        r: { type: 'boolean', alias: 'respec',          default: false, description: 'The source is in respec.', },
        p: { type: 'boolean', alias: 'package',         default: false, description: '[Debug] Do not generate an EPUB file, just print the package file content.', },
        t: { type: 'boolean', alias: 'trace',           default: false, description: '[Debug] Print built in trace information.', },
        d: { type: 'string',  alias: 'publishDate',     default: null,  description: 'Publication date.', },
        s: { type: 'string',  alias: 'specStatus',      default: null,  description: 'Specification type.', },
        l: { type: 'string',  alias: 'addSectionLinks', default: null,  description: 'Add section links with "§".', },
        m: { type: 'number',  alias: 'maxTocLevel',     default: null,  description: 'Max TOC level.', },
    })
    .version()
    .wrap(null)
    .argv;

    const args :convert.Arguments = {
        url             : argv._.length === 0 ? 'http://localhost:8001/TR/vc-data-model/' : argv._[0],
        respec          : argv.r || argv.d || argv.s || argv.l || argv.m,
        config          : {
            publishDate     : argv.d,
            specStatus      : argv.s,
            addSectionLinks : argv.l,
            maxTocLevel     : argv.m
        }
     }

    try {
        const conversion_process     = new convert.RespecToEPUB(argv.t, argv.p);
        const the_ocf :ocf.OCF   = await conversion_process.create_epub(args);
        const content :Buffer | Blob = await the_ocf.get_content();

        fs.writeFileSync(argv.o || the_ocf.name, content);
    } catch(e) {
        console.error(`EPUB Generation error: "${e}"`);
    }
}

cli();
