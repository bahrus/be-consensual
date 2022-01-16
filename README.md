# be-consensual

Provides two-way binding between a checkbox (or other (custom) DOM elements) and surrounding checkboxes (or other (custom) DOM elements).

```html
<input type=checkbox be-consensual='{
    "elementSelector": ".selector",
    "onStateSelector": ":checked",
    "offStateSelector": ":not(:checked)",
    "prop": "checked",
    "trueVal": true,
    "falseVal": false,
    "selfProp": "checked",
    "selfTrueVal": true,
    "selfFalseVal": false
}'>
```

Monitors all elements matching elementSelector within the shadow DOM realm.

Checks if each element matches the onStateSelector.   If so, that element is considered "true".  If offStateSelector is a match, the element is considered "false".  All other matching elements are considered "indeterminate".

If all elements are true, then the element be-consensual adorns is checked.  If all elements are false, the target element is unchecked.  If a mixture of true / false / indeterminate, then the target element is made indeterminate.

If the element be-consensual is adorning is checked, then all the elements matching the element selector become checked.  Likewise with unchecked.

The property to set is configurable (prop), as are the true and false values.

