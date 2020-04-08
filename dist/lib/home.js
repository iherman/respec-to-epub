"use strict";
/**
 * The stable Web page, displayed by the server if there is no query string. It just displays some basic information about the usage of a server.
 *
 * (It is a single string with the HTML content, with a pattern to replaced with the host URL with.)
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** @hidden */
exports.homepage = `<!doctype html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Service to convert W3C Technical Reports to EPUB 3.2</title>
    <link rel='stylesheet' href='https://www.w3.org/StyleSheets/TR/2016/base.css' />
</head>

<body>
    <main>
        <h1>Service to convert W3C Technical Reports to EPUB 3.2</h1>

        <p>
            Service to convert W3C HTML documents, produced by <a href="https://www.w3.org/respec/">ReSpec</a>, to EPUB 3.2.
        </p>

        <p>
            The server takes the parameters in a query string, generates and returns an EPUB 3.2 instance to the caller. The possible query parameters are:
        </p>

        <dl>
            <dt><code>url</code></dt>
            <dd>The URL for the content. <em>This value is required</em>.</dd>

            <dt><code>respec</code></dt>
            <dd>Whether the source is in respec (<code>true</code>) or a final HTML (<code>false</code>).</dd>

            <dt><code>publishDate</code></dt>
            <dd>Publication date. Overwrites the <a href='https://github.com/w3c/respec/wiki/publishDate'>value in the <code>respecConfig</code> structure</a> in the source.</dd>

            <dt><code>specStatus</code></dt>
            <dd>Specification date. Overwrites the <a href='https://github.com/w3c/respec/wiki/specStatus'>value in the <code>respecConfig</code> structure</a> in the source.</dd>

            <dt><code>addSectionLinks</code></dt>
            <dd>Add section links with <code>§</code>. Overwrites the <a href='https://github.com/w3c/respec/wiki/addSectionLinks'>value in the <code>respecConfig</code> structure</a> in the source.</dd>

            <dt><code>maxTocLevel</code></dt>
            <dd>Add section links with <code>§</code>. Overwrites the <a href='https://github.com/w3c/respec/wiki/maxTocLevel'>value in the <code>respecConfig</code> structure</a> in the source.</dd>

        </dl>

        <p>
            By default, the value of <code>respec</code> is <code>false</code>. However, if one of <code>publishDate</code>, <code>specStatus</code>, <code>addSectionLinks</code>, or <code>maxTocLevel</code> are set, <code>respec=true</code> is implied (i.e., it is not necessary to set it explicitly).
        </p>

        <h2>Usage examples</h2>

        <p>
            Convert the HTML file (as generated by ReSpec) to an EPUB 3.2 file. The generated publication's name is <code>short-name.epub</code>, where <code>short-name</code> is set in the ReSpec configuration:
        </p>

        <pre>%%%SERVER%%%?url=https://www.example.org/doc.html</pre>

        <p>Convert the HTML <em>ReSpec source</em> to an EPUB 3.2 file. The source is converted on-the-fly by respec:</p>

        <pre>%%%SERVER%%%?url=https://www.example.org/doc.html&respec=true</pre>

        <p>Convert the HTML <em>ReSpec source</em> to an EPUB 3.2 file, setting its spec status to REC. The source is converted on-the-fly by respec, overwriting the <code>specStatus</code> entry in the configuration to <code>REC</code>:</p>

        <pre>%%%SERVER%%%?url=https://www.example.org/doc.html&respec=true&specStatus=REC</pre>

    </main>
    <footer style='font-size:80%; border-top: thin solid black;'>
        <p>This server runs the <a href='https://github.com/iherman/respec-to-epub/'>respec-to-epub</a> package, implemented by <a href='https://www.ivan-herman.net/professional'>Ivan Herman</a>.</p>
    </footer>
</body>
</html>
`;
//# sourceMappingURL=home.js.map