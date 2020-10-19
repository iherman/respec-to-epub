"use strict";
/**
 * ## Representation of a single chapter.
 *
 * See [[Chapter]] for the details.
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chapter = exports.transfer_once = void 0;
const constants = __importStar(require("../lib/constants"));
const rConvert = __importStar(require("../lib/convert"));
const xmldom = __importStar(require("xmldom"));
/**
 * These are common items for all individual book generated by r2epub, and used by the cover page. This must be transferred to the final book, but only once.
 */
exports.transfer_once = [
    'StyleSheets/base.css',
    'Icons/w3c_main.png',
];
/**
 * These resources are present in the chapter's OCF, but should be regenerated from scratch for the final book. This means that this particular resource should not be transferred.
 */
const never_transfer = [
    'mimetype',
    'META-INF/container.xml',
    'package.opf',
    'nav.xhtml',
    'title.xhtml',
    'cover_image.svg'
];
/**
 * Wrapper around a single chapter. The main action is in the [[initialize]] method, which collects all the data and extracts additional data that are necessary elsewhere.
 */
class Chapter {
    /**
     *
     * @param args - arguments needed to create the chapter’s OCF.
     * @param first - whether this is the first chapter in the book. Necessary, for example, to transfer the items listed in [[transfer_once]] for a book.
     */
    constructor(args, first = false) {
        this._first_chapter = false;
        this._manifest = [];
        this._editors = [];
        this._non_linear_spine_items = [];
        this._wcag_conforms = false;
        this._url = args.url;
        this._options = {
            respec: args.respec,
            config: args.config
        };
        this._first_chapter = first;
    }
    /**
     * The real initialization must be done in a separate method and not in the constructor, because
     * async actions are (heavily) involved...
     *
     * The method starts by running r2epub on the original arguments, and the uses the jszip methods (see the [jszip documentation](https://stuk.github.io/jszip/)) to extract the content.
     *
     * The following items are extracted, and stored, from the chapter’s OCF:
     *
     * * The list of all the data items to be transferred, together with their media types (as a list of [[ManifestItem]] structures);
     * * The list of editors;
     * * The publication date;
     * * The publication title;
     * * The navigation file’s content (as a text).
     *
     * @returns - the value of `this` for an easier management on the caller side.
     * @async
     */
    async initialize() {
        // First and foremost: create the OCF container
        this._ocf = await (new rConvert.RespecToEPUB()).create_epub(this._url, this._options);
        this._container = this._ocf.book;
        // remove the `.epub` suffix for the name
        this._chapter_name = this._ocf.name.slice(0, -5);
        // ---------------------------------------------------------------------------------------
        // Get hold of the package file; it is used to establish the authors' list, publication date,
        // as well as the media types for all the content involved.
        const package_file = await this._container.file('package.opf').async('text');
        const package_dom = (new xmldom.DOMParser()).parseFromString(package_file);
        // ---------------------------------------------------------------------------------------
        // Get the information on the manifest items
        // The manifest must be filtered: some items are not really part of the chapter but, rather,
        // part of the enclosing OCF; those have to be regenerated anyway, so must be ignored.
        //
        // Additionally to what is in the package file, the manifest item's content is retrieved via a Promise.
        // the format depends on the media type: textual content are easy, binary content must use base64 to be retrieved and,
        // later, stored
        const items = package_dom.getElementsByTagName('item');
        const not_to_transfer = this._first_chapter ? never_transfer : [...exports.transfer_once, ...never_transfer];
        for (let i = 0; i < items.length; i++) {
            // Whether the item is a textual content or not depends on its media type:
            const item = items[i];
            const file_name = item.getAttribute('href');
            if (!not_to_transfer.includes(file_name)) {
                const media_type = item.getAttribute('media-type');
                const properties = item.hasAttribute('properties') ? item.getAttribute('properties') : undefined;
                const id = item.getAttribute('id');
                // This list in r2epub lists those media types that can be transferred as texts
                const textual = constants.text_content.includes(media_type);
                const promise = this._container.file(file_name).async(textual ? 'text' : 'base64');
                // Create the relevant [[ManifestItem]]
                this._manifest.push({
                    href: file_name,
                    media_type: media_type,
                    id: id,
                    properties: properties,
                    text_content: textual,
                    promise: promise,
                });
            }
        }
        ;
        // Note that, until now, the Promises have been created but not yet (necessarily) completed; a wait on all promises is necessary to move on
        const contents = await Promise.all(this._manifest.map((item) => item.promise));
        // Push the content back to the manifest array. It is in a format that jszip understands for subsequent storage
        contents.forEach((content, index) => this._manifest[index].content = content);
        // ---------------------------------------------------------------------------------------
        // Get the list of authors
        const editors = package_dom.getElementsByTagName('dc:creator');
        for (let i = 0; i < editors.length; i++) {
            this._editors.push(editors[i].textContent);
        }
        // ---------------------------------------------------------------------------------------
        // Get the title of the publication
        const titles = package_dom.getElementsByTagName('dc:title');
        this._title = titles[0].textContent;
        // ---------------------------------------------------------------------------------------
        // Get the identifier of the publication
        const identifiers = package_dom.getElementsByTagName('dc:identifier');
        this._identifier = identifiers[0].textContent;
        // ---------------------------------------------------------------------------------------
        // Get the date of the publication
        const meta_elements = package_dom.getElementsByTagName('meta');
        for (let i = 0; i < meta_elements.length; i++) {
            const meta = meta_elements[i];
            // The (artificial) time portion is removed to avoid being duplicated
            if (meta.hasAttribute('property') && meta.getAttribute('property') === 'dcterms:date') {
                this._date = meta.textContent.split('T')[0];
                break;
            }
        }
        // ---------------------------------------------------------------------------------------
        // See if the chapter is wcag conforms
        const link_elements = package_dom.getElementsByTagName('link');
        for (let i = 0; i < link_elements.length; i++) {
            const rel = link_elements[i].getAttribute('rel');
            if (rel === 'dcterms:conformsTo') {
                this._wcag_conforms = true;
                break;
            }
        }
        // ---------------------------------------------------------------------------------------
        // Get the non-linear spine items
        const itemref_elements = package_dom.getElementsByTagName('itemref');
        for (let i = 0; i < itemref_elements.length; i++) {
            const itemref = itemref_elements[i];
            if (itemref.hasAttribute('linear') && itemref.getAttribute('linear') === 'no') {
                this._non_linear_spine_items.push(itemref.getAttribute('idref'));
            }
        }
        // ---------------------------------------------------------------------------------------
        // Get the navigation file's content
        this._nav = await this._container.file('nav.xhtml').async('text');
        // ---------------------------------------------------------------------------------------
        return this;
    }
    /**
     * Internal function: the name of the manifest item must be altered when stored in the final book to avoid clashes
     * @param orig_name - the original name in the chapter
     * @returns - modified name
     */
    set_name(orig_name) {
        return exports.transfer_once.includes(orig_name) ? orig_name : `${this.chapter_name}/${orig_name}`;
    }
    /**
     * Convert the Overview.xhtml file by converting the possible mutual references to other chapters
     * @param target
     */
    handle_cross_references(overview, target) {
        // Collect the possible targets
        const xref_targets = target.chapters
            .map((chapter) => chapter.chapter_name)
            .filter((name) => name !== this.chapter_name);
        let final_overview = overview;
        xref_targets.forEach((chapter_name) => {
            const cross_references = new RegExp(`href=(["|'])http[s]{0,1}://www.w3.org/TR/${chapter_name}/`, 'gim');
            final_overview = final_overview.replace(cross_references, `href=$1../${chapter_name}/Overview.xhtml`);
        });
        return final_overview;
    }
    /**
     * Store all the manifest items in the book, represented by its target OCF. This is based on the list collected in [[initialize]].
     * @param target - the target publication
     */
    store_manifest_items(target) {
        const target_ocf = target.ocf;
        this._manifest.forEach((item) => {
            const option = { compression: 'DEFLATE' };
            if (!item.text_content) {
                option.binary = true;
                option.base64 = true;
            }
            // store the value; note that the name is expanded to store the files in the separate folder for that chapter
            // Note the the Overview.xhtml file needs a special treatment...
            target_ocf.book.file(this.set_name(item.href), item.href === 'Overview.xhtml' ? this.handle_cross_references(item.content, target) : item.content, option);
        });
    }
    /**
     * The date of the chapter as a string.
     */
    get date() {
        if (this._ocf === undefined) {
            throw `Chapter '${this._url}' has not been initialized`;
        }
        return this._date;
    }
    /**
     * The list of editors as an array of strings.
     */
    get editors() {
        if (this._ocf === undefined) {
            throw `Chapter '${this._url}' has not been initialized`;
        }
        return this._editors;
    }
    /**
     * The (HTML source) of the navigation file as a string.
     */
    get nav() {
        if (this._ocf === undefined) {
            throw `Chapter '${this._url}' has not been initialized`;
        }
        return this._nav;
    }
    /**
     * The chapter’s name as a string.
     */
    get name() {
        if (this._ocf === undefined) {
            throw `Chapter '${this._url}' has not been initialized`;
        }
        return this._chapter_name;
    }
    /**
     * The list of minimal manifest item information as an array of [[OPFManifestItem]] instances, necessary to build the new OPF content.
     */
    get opf_items() {
        if (this._ocf === undefined) {
            throw `Chapter '${this._url}' has not been initialized`;
        }
        return this._manifest.map((item) => {
            return {
                href: this.set_name(item.href),
                media_type: item.media_type,
                properties: item.properties,
                id: item.id
            };
        });
    }
    /**
     * The list of non-linear spine items as an array of strings (ie, the idref values), necessary to build the new OPF content.
     */
    get non_linear_spine_items() {
        return this._non_linear_spine_items;
    }
    /**
     * The chapter’s name as a string.
     */
    get chapter_name() {
        return this._chapter_name;
    }
    /**
     * The chapter’s title as a string.
     */
    get title() {
        if (this._ocf === undefined) {
            throw `Chapter '${this._url}' has not been initialized`;
        }
        return this._title;
    }
    /**
     * The chapter’s identifier as a string.
     */
    get identifier() {
        if (this._ocf === undefined) {
            throw `Chapter '${this._url}' has not been initialized`;
        }
        return this._identifier;
    }
    /**
     * Is this the first chapter?
     */
    get first_chapter() {
        return this._first_chapter;
    }
    /**
     * Conforms to WCAG Level A
     */
    get wcag_conforms() {
        return this._wcag_conforms;
    }
}
exports.Chapter = Chapter;
//# sourceMappingURL=chapter.js.map