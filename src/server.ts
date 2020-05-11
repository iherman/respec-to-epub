/**
 * ## Simple server for EPUB generation
 *
 * It takes the parameters in a query string, generates and returns an EPUB 3.2 instance to the caller.
 *
 * The possible query parameters are
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
 *
 * The module is a wrapper around a standard node.js `http.CreateServer`, and a call to [[create_epub]].
 *
 * ### Usage examples:
 *
 * (In all examples, the URL for the server is set to `https://epub.example.org`)
 *
 * Convert the HTML file (as generated by ReSpec) to an EPUB 3.2 file. The generated publication's name is `short-name.epub`, where `short-name` is set in the ReSpec configuration:
 *
 * ``` sh
 * https://epub.example.org?url=https://www.example.org/doc.html
 * ```
 *
 * Convert the HTML _ReSpec source_ to an EPUB 3.2 file. The source is converted on-the-fly by respec:
 *
 * ``` sh
 * https://epub.example.org?url=https://www.example.org/doc.html&respec=true`
 * ```
 *
 * Convert the HTML _ReSpec source_ to an EPUB 3.2 file, setting its spec status to REC. The source is converted on-the-fly by respec, overwriting the `specStatus` entry in the configuration to `REC`:
 *
 * ``` sh
 * https://epub.example.org?url=https://www.example.org/doc.html&respec=true&specStatus=REC`
 * ```

 * @packageDocumentation
 */

 /**
 *
 *
 */


import http            from 'http';
import * as urlHandler from 'url';
import * as _          from 'underscore';
import * as constants  from './lib/constants';
import * as convert    from './lib/convert';
import * as ocf        from './lib/ocf';
import * as home       from './lib/home';


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
    [index :string] :string|string[]|boolean
}

/**
 * Generate the EPUB file. This is a wrapper around [[create_epub]], creating the necessary arguments [[Arguments]] structure based on the incoming URL's query string.
 *
 * @param query - The query string from the client
 */
async function get_epub(query :Query) : Promise<Content> {
    const respec_args = _.omit(query, 'respec', 'url', 'submit');
    _.keys(respec_args).forEach((key :string) => {
        if (respec_args[key] !== undefined && (respec_args[key] === '' || respec_args[key] === 'null')) {
            delete respec_args[key];
        }
    });

    const document :convert.Arguments = {
        url    : query.url as string,
        respec : (query.respec !== undefined && (query.respec === 'true' || query.respec === true)),
        config : respec_args,
    }

    const conversion_process   = new convert.RespecToEPUB(false, false);
    const the_ocf :ocf.OCF     = await conversion_process.create_epub(document);
    const content :Buffer      = await the_ocf.get_content() as Buffer;

    const now :string = (new Date()).toString();

    return {
        content : content,
        headers : {
            'Content-type'        : constants.media_types.epub,
            'Expires'             : now,
            'Last-Modified'       : now,
            'Content-Length'      : content.length,
            'Accept-Ranges'       : 'none',
            'Content-Language'    : 'en-US',
            'Content-Disposition' : `attachment; filename=${the_ocf.name}`
        }
    }
 }

/**
 * Run a rudimentary Web server calling out to [[create_epub]] via [[get_epub]] to return an EPUB 3.2 instance when invoked. If there is no proper query string a fixed page is displayed.
 */
async function serve() {
    const port :string = process.env.PORT || constants.local_port_number;
    http.createServer(async (request :http.IncomingMessage, response :http.ServerResponse) => {
        const error = (code :number, e :string) => {
            response.writeHead(code, {
                'Content-type' : 'text/plain'
            });
            response.write(e);
        }
        try {
            if (request.method === 'GET' || request.method === 'HEAD') {
                const query :Query = urlHandler.parse(request.url, true).query;
                const host = `http://${request.headers.host}`;

                if (query === null || query.url === undefined) {
                    // fall back on the fixed home page
                    response.writeHead(200, _.extend(
                        { 'Content-type' : 'text/html'},
                        constants.CORS_headers
                    ));
                    response.write(home.homepage.replace(/%%%SERVER%%%/g, host));
                } else {
                    const the_book :Content = await get_epub(query);
                    response.writeHead(200, _.extend(
                        the_book.headers,
                        constants.CORS_headers
                    ));
                    response.write(the_book.content);
                }
            } else {
                error(501, `Invalid HTTP request method: ${request.method}`);
            }
        } catch(e) {
            error(500, `Error during EPUB generation: ${e.toString()}`);
        } finally {
            response.end();
        }
    }).listen(port);
}

serve();

