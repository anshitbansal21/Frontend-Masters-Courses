function getBreedFromURL(url) {
  // The string method .split(char) may come in handy
  // Try to use destructuring as much as you can
  let unsplitBreed = url.split('/')[4];
  let splitBreed = unsplitBreed.split('-');

  return splitBreed.reverse.join(' '); //joined breed
}

let x = 'anshit'.split('-');
console.log(x.join('-'));
