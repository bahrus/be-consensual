# be-consensual

```html
<input type=checkbox be-consensual='{
    "elementSelector": ".selector",
    "onStateSelector": ":checked",
    "offStateSelector": ":not(:checked)",
    
}'>
```

Monitors all elements matching elementSelector within the shadowDOM realm.

Checks if each element matches the onStateSelector.   If so, that element is considered "true".  If offStateSelector is a match, the element is considered "false".  All other matching elements are considered "indeterminate".

If all elements are true, then the element be-consensual adorns is checked.  If all elements are false, the target element is unchecked.  If a mixture of true / false / indeterminate, then the target element is made indeterminate.