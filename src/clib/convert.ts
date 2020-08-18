/**
 * ## Main Entry point for collections
 *
 * This is the core entry point for the management of collections. It is a layer _on top_ of the “core” r2epub functionality, i.e., the creation of an EPUB 3 instance for an individual HTML document.
 *
 * The general approach for the creation of collection is as follows:
 *
 * 1. Each individual document reference (a.k.a. “chapters”) are generated by the core layer of r2epub. The resulting [[OCF]] contents are collected in a separate array of [[Chapter]] class instances
 * 2. A new [[OCF]] instance is created for the collection; the resources from each chapter are copied into this one, modifying the file names of the chapter on the fly. This means each charter is copied
 * into its own subdirectory
 * 3. A new [OPF](../classes/_lib_opf_.packagewrapper.html) file is created, collecting the relevant entries of the chapters’ respective OPF files, modifying the names on the fly
 * 4. A new navigation file is created, collecting and merging the navigation content of each individual chapter.
 * 5. A collection specific cover page is created.
 *
 *
 * See [[create_epub]] for further details.
 *
 * @packageDocumentation
 */


 /**
  *
  */

import { Options }      from '../index';
import {PackageWrapper} from '../lib/opf';
import * as ocf         from '../lib/ocf';
import * as rConvert    from '../lib/convert';
import * as fetch       from '../lib/fetch';
import { Chapter }      from './chapter';
import * as nav         from './nav';
import * as opf         from './opf';
import * as cover       from './cover';
import * as args        from './args';
import * as _           from 'underscore';

/**
 * Arguments used by the internal conversion functions; just combining the possible options with the URL for a more compact handling.
 *
 */
export interface ChapterConfiguration extends Options {
    /** The URL of the relevant HTML or JSON file. If the latter, the JSON file must be a configuration file for a full Collection, and the other fields are ignored. */
    url :string,
}


/**
 * Type definition for the collection data the user has to provide. It is, essentially, the Typescript equivalent of the JSON configuration file's [schema](https://github.com/iherman/src/clib/r2epub.schema.json).
 */
export interface CollectionConfiguration {
    /** Title of the publication. */
    name         :string;
    /** "Short" name, used as an identifier and as the base name for the final EPUB file. */
    id           :string;
    /** Chapter description: url, whether respec should be used, and possible respec arguments. See the [[Options]] for some further details). */
    readingOrder :ChapterConfiguration[];
}

/**
 * Internal representation of a collection.
 */
export interface Collection {
    /** Title of the publication. */
    title      :string;
    /** "Short" name, used as an identifier and as the base name for the final EPUB file. */
    name       :string;
    /** List of editors: it is a concatenation of the editors of the individual chapters, with duplicate names removed. */
    editors?   :string[];
    /** Date of publication: the most recent date among the constituent chapter. */
    date?      :string,
    /** The [OCF instance](https://iherman.github.io/r2epub/typedoc/modules/_lib_ocf_.html) of the target book. */
    ocf        :ocf.OCF;
    /** Representations of the individual chapters. */
    chapters   :Chapter[];
}

/**
 * Creation of the real book data. The method runs a [conversion for a single document](../classes/_lib_convert_.respectoepub.html#create_epub) on all chapters, creates the relevant [[Chapter]] instances, and retrieves some book level data to be used in subsequent steps.
 *
 * @async
 * @param book_data - user supplied configuration data
 * @returns the [[Collection]] structure with all [[Chapter]] entries properly initialized.
 */
const generate_book_data = async (book_data: CollectionConfiguration) :Promise<Collection> => {
    // Just to make things more readable, I take the steps separately instead of putting directly into the return value...
    // 1. An array of chapters is created from the argument data
    // 2. Each chapter is initialized. Initialization is async, ie, each of these steps create a Promise.
    //    Note that the first chapter is signalled so that the common files (logo, css for cover page, etc) are also transferred to the final book, but only once.
    const promises :Promise<Chapter>[] = book_data.readingOrder.map((chapter_data :ChapterConfiguration, index :number) :Promise<Chapter> => (new Chapter(chapter_data, index === 0)).initialize());

    // 3. Sync at this point by waiting for all Promises to resolve, yielding the list of chapters.
    const chapters :Chapter[] = await Promise.all(promises);

    // 4. Collect all the editors, it will be used later...
    const editors  :string[]  =  _.flatten(chapters.map((chapter :Chapter) :string[] => chapter.editors));

    // 5. Collect the date, it will be used later...
    //    The maximal value of all constituent dates is used
    const dates :string[] = chapters.map((chapter :Chapter) :string => chapter.date);
    const date  :string   = dates.reduce((accumulator, currentValue) => accumulator>currentValue ? accumulator : currentValue);

    // Yep, we got the book skeleton
    return {
        title    : book_data.name,
        name     : book_data.id,
        editors  : _.unique(editors),
        date     : date,
        ocf      : new ocf.OCF(`${book_data.id}.epub`),
        chapters : chapters
    }
}

/**
 * Creation of an [OCF instance](https://iherman.github.io/r2epub/typedoc/modules/_lib_ocf_.html) for the final book.
 *
 * The main processing steps are:
 *
 * 1. Convert the user JSON configuration to the internal data structure (see [[get_book_configuration]]) and collect the data for the output target (see [[generate_book_data]]);
 * 2. Create (and store in the target’s OCF) the package file (see [[create_opf]]);
 * 3. Create (and store in the target’s OCF) the cover page (see [create_cover_page](../modules/_clib_cover_.html#create_cover_page));
 * 4. Create (and store in the target’s OCF) the navigation file for the whole book (see [[create_nav_page]]);
 * 5. Collect, from each [[Chapter]] the real content from the chapter’s OCF and copy it to the target’s OCF (with modified file path values).
 *
 * @async
 * @param config_url - the user supplied data, i.e., the result of JSON parsing of the input argument
 * @param trace whether tracing is set (for debugging)
 * @param print_package whether the package stops at the creation of an EPUB content and displays the content of the OPF file itself (for debugging)
 * @returns a Promise holding the final [OCF](https://iherman.github.io/r2epub/typedoc/classes/_lib_ocf_.ocf.html) content.
 */
export async function create_epub(config_url: string, trace :boolean = false, print_package: boolean = false) :Promise<ocf.OCF> {
    const data :any = await fetch.fetch_json(config_url);

    // check, via a JSON schema, the validity of the input and create the right arguments
    const book_data :CollectionConfiguration = args.get_book_configuration(data);

    // generate the skeleton of the book
    const the_book :Collection = await generate_book_data(book_data);

    // Create the OPF file, the cover and nav pages, and store each of them in the book at
    // well specified places
    const the_opf :string = opf.create_opf(the_book);
    if (print_package) {
        console.log(the_opf);
        return {} as ocf.OCF;
    } else {
        the_book.ocf.append(the_opf                          , 'package.opf');
        the_book.ocf.append(cover.create_cover_page(the_book), 'cover.xhtml');
        the_book.ocf.append(nav.create_nav_page(the_book)    , 'nav.xhtml');

        // Store the data in the final zip file
        the_book.chapters.forEach((chapter :Chapter) :void => {
            chapter.store_manifest_items(the_book);
        });
        return the_book.ocf;
    }
}


