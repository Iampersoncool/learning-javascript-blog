'use strict';

const searchEl = document.querySelector('input[type=search]');

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case '/':
      searchEl.focus();
      break;
    case 'Escape':
      searchEl.blur();
      break;
    default:
      break;
  }
});
