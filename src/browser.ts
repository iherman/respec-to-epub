/**
 * ## Browser interface
 *
 * Bridge between the HTML form and the conversion facilities. It relies on `<input>` elements with the `id` values set to
 * `url`, `respec`, `publishDate`, `specStatus`, `addSectionLinks`, and `maxTocLevel`.
 *
 * This script must be converted to Javascript and the browserified to be used in an HTML page.
 *
 * @packageDocumentation
 */

import * as ocf        from './lib/ocf';
import * as conversion from './lib/conversion';
import * as fetch      from './lib/fetch';

/**
 *
 * Collect and pre-process the form parameters
 *
 */
const submit = () :void => {
    // const the_form :HTMLFormElement = document.getElementById('main_form') as HTMLFormElement;
    const url :HTMLInputElement = document.getElementById('url') as HTMLInputElement;
    const respec :HTMLInputElement = document.getElementById('respec') as HTMLInputElement;
    const publishDate :HTMLInputElement = document.getElementById('publishDate') as HTMLInputElement;
    const specStatus :HTMLInputElement = document.getElementById('specStatus') as HTMLInputElement;
    const addSectionLinks :HTMLInputElement = document.getElementById('addSectionLinks') as HTMLInputElement;
    const maxTocLevel :HTMLInputElement = document.getElementById('maxTocLevel') as HTMLInputElement;


    if (!(url.value === null || url.value === '')) {
        const a :conversion.Arguments  = {
            url    : url.value,
            respec : respec.value === 'true',
            config : {
                publishDate     : publishDate.value === '' ? undefined : publishDate.value,
                specStatus      : specStatus.value === 'null' ? undefined : specStatus.value,
                addSectionLinks : addSectionLinks.value === 'null' ? undefined : addSectionLinks.value,
                maxTocLevel     : maxTocLevel.value === '' ? undefined : maxTocLevel.value,
            }
        }
        alert(JSON.stringify(a, null, 4));
    }
}

window.addEventListener('load', () => {
    const submit_button = document.getElementById('submit');
    submit_button.addEventListener('click', submit);
});
