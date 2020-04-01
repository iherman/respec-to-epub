/**
 * ## Simple server for EPUB generation
 *
 * It takes the parameters in a query string, generates and returns an epub to the caller.
 *
 * The query parameters are
 *
 * ```
 * url              The URL for the content
 * respec           Whether the source is in respec (true) or a final HTML (false).
 * publishDate      Publication date
 * specStatus       Specification type
 * addSectionLinks  Add section links with "§"
 * maxTocLevel      Max TOC level
 *```
 *
 * By default, the value of `respec` is `false`. This query entry _must_ be set for the other options to be effective.
 *
 *
 * The module is a wrapper around a standard node.js `http.CreateServer`, and a call to [[create_epub]].
 *
 * ### Usage examples:
 *
 * (In all examples, the URL for the server is set to `https://epub.example.org`)
 *
 * Convert the HTML file (as generated by ReSpec) to an EPUB 3.2 file. The generated publication's name is `short-name.epub`, where `short-name` is set in the ReSpec configuration:
 *
 * ```
 * https://epub.example.org?url=https://www.example.org/doc.html
 * ```
 *
 * Convert the HTML _ReSpec source_ to an EPUB 3.2 file. The source is converted on-the-fly by respec:
 *
 * ```
 * https://epub.example.org?url=https://www.example.org/doc.html&respec=true`
 * ```
 *
 * Convert the HTML _ReSpec source_ to an EPUB 3.2 file, setting its spec status to REC. The source is converted on-the-fly by respec, overwriting the `specStatus` entry in the configuration to `REC`:
 *
 * ```
 * https://epub.example.org?url=https://www.example.org/doc.html&respec=true&specStatus=REC`
 * ```

 * @packageDocumentation
 */


import http            from 'http';
import * as urlHandler from 'url';
import * as _          from 'underscore';
import * as constants  from './lib/constants';
import * as conversion from './lib/conversion';
import * as ocf        from './lib/ocf';


/**
 * Return value of [[get_epub]], to be handled by the server;
 */
interface Content {
    /**
     * The real epub content: a Buffer as generated through the [[OCF]] class.
     */
    content :Buffer;
    /**
     * Additional HTTP Response headers, to accompany the full response. (File name, dates, etc.).
     */
    headers :object;
}

/**
 * @hidden
 */
interface Query {
    [index :string] :string|string[]
}


/**
 * Generate the EPUB file. This is a wrapper around [[create_epub]], creating the necessary arguments [[Arguments]] structure based on the incoming URL's query string.
 *
 * @param query - The query string from the client
 * @throws no URL has been specified
 */
async function get_epub(query :Query) : Promise<Content> {
    if (query === null || query.url === undefined) {
        throw "No URL has been specified"
    } else {
        const document :conversion.Arguments = {
            url    : query.url as string,
            respec : query.respec === undefined ? false : query.respec === 'true' || query.respec === 'True',
            config : _.omit(query, 'respec', 'url'),
        }

        const conversion_process = new conversion.RespecToEPUB(false, false);
        const the_ocf :ocf.OCF   = await conversion_process.create_epub(document);
        const content :Buffer    = await the_ocf.get_content();

        return {
            content : content,
            headers : {
                'Content-type'        : constants.media_types.epub,
                // 'Content-Length'      : content.length,
                'Expires'             : (new Date()).toString(),
                'Content-Disposition' : `attachment; filename=${the_ocf.name}`
            }
        }
    }
}


/**
 * Run a rudimentary Web server calling out to [[create_epub]] via [[get_epub]] to return an EPUB 3.2 instance when invoked.
 *
 * @param port - port number
 */

async function serve(port :string = constants.port_number) {
    http.createServer( async (request :http.IncomingMessage, response :http.ServerResponse) => {
        try {
            const query :Query = urlHandler.parse(request.url, true).query;
            const the_book :Content = await get_epub(query);

            response.writeHead(200, _.extend(
                the_book.headers,
                constants.CORS_headers
            ));
            response.write(the_book.content);
            response.end();
        } catch(e) {
            response.writeHead(400, {
                'Content-type' : 'text/plain'
            });
            response.write(`Error during EPUB generation: ${e.toString()}`);
            response.end();
        }
    }).listen(port);
}

// Let the user choose the port number...
process.argv.length > 2 && isNaN(Number(process.argv[2])) === false ? serve(process.argv[2]) : serve();
