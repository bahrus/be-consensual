# be-consensual

Provides two-way binding between a checkbox (or other (custom) DOM elements) and surrounding checkboxes (or other (custom) DOM elements).

[![Playwright Tests](https://github.com/bahrus/be-consensual/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-consensual/actions/workflows/CI.yml)

<a href="https://nodei.co/npm/be-consensual/"><img src="https://nodei.co/npm/be-consensual.png"></a>

Size of package, including custom element behavior framework (be-decorated):

[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-consensual?style=for-the-badge)](https://bundlephobia.com/result?p=be-consensual)

Size of new code in this package:

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-consensual?compression=gzip">

```html
<input type=checkbox be-consensual>
```

is short-hand for:

```html
<input type=checkbox be-consensual='{
    "memberAttr": "be-consensual-member",
    "memberProp": "checked",
    "memberTrueVal": true,
    "memberFalseVal": false,
    "selfProp": "checked",
    "selfTrueVal": true,
    "selfFalseVal": false
}'>
```

i.e. all the settings shown are default values.

Monitors all elements with attribute "be-consensual-member" (by default) within the shadow DOM realm.

Checks if each element's memberProp property matches the memberTrueVal value.   If so, that element is considered "true".  If the value matches the memberFalseVal, the element is considered "false".  All other matching elements are considered "indeterminate".

If all elements are true, then the element be-consensual adorns is checked (based on setting the selfProp specified property to the selfTrueVal value).  If all elements are false, the target element is unchecked.  If a mixture of true / false / indeterminate, then the target element is made indeterminate.

If the element be-consensual is adorning is checked, then all the elements matching the element selector become checked.  Likewise with unchecked.

The property to set is configurable (prop), as are the true and false values.

## Viewing Locally

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/dev in a modern browser.

## Importing in ES Modules:

```JavaScript
import 'be-consensual/be-consensual.js';
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-consensual';
</script>
```

