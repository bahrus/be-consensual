# be-consensual

Provides two-way binding between a checkbox (or other (custom) DOM elements) and surrounding checkboxes (or other (custom) DOM elements).

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

Monitors all elements with attribute "be-consensual-member" (by default) within the shadow DOM realm.

Checks if each element's memberProp property matches the memberTrueVal value.   If so, that element is considered "true".  If the value matches the memberFalseVal, the element is considered "false".  All other matching elements are considered "indeterminate".

If all elements are true, then the element be-consensual adorns is checked (based on setting the selfProp specifed propety to the selfTrueVal).  If all elements are false, the target element is unchecked.  If a mixture of true / false / indeterminate, then the target element is made indeterminate.

If the element be-consensual is adorning is checked, then all the elements matching the element selector become checked.  Likewise with unchecked.

The property to set is configurable (prop), as are the true and false values.

