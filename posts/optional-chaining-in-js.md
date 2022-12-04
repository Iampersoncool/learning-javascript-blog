---
title: Optional chaining in javascript
date: 2022-12-03
description: Optional chaining in javascript. What is it and how to use it
containsCode: true
---

# Optional chaining in JS

Normal way to do it:

```javascript
const btn = document.querySelector('button');

if (btn !== null) {
  btn.onclick = () => alert('You clicked the button!');
}
```

This way isn't really that good since you have to write

another if statement, and it doesn't look

very clean(in my humble opinion).
<br>

I think a better way to do it is like this:

```javascript
const btn = document.querySelector('button');

btn?.onclick = () => alert('You clicked the button!');
```

<br>

Notice the question mark. This makes sure that if it

is null or undefined, it won't execute the code after.

It will also return undefined if you try to create a variable

with it.
