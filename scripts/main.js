const $ = require('jquery');

const BASE_URL = 'https://pixabay.com/api?key=7449813-3f6b2a4c78c08db391996117d';

// first functional utility, it creates another function
// which will take the property from the object and return it
const prop = property => x => x[property];
// second functional utility, it creates another function
// which takes a predicate function to remove every element which does not
// match the current condition
const filter = fn => xs => xs.filter(fn);
// third functional utility, it creates another function to map
// with a transform function the current list to something else
const map = fn => xs => xs.map(fn);

const fetchByTerm = (searchTerm) => {
  return $.get(`${BASE_URL}&q=${encodeURI(searchTerm)}`);
};

const impureDOM = (() => {
  const $searchTerm = $('#searchTerm');
  const $numberOfLikes = $('#numberOfLikes');
  const $width = $('#width');
  const $height = $('#height');

  return {
    read: () => {
      const searchTerm = $searchTerm.val();
      const likes = parseInt($numberOfLikes.val(), 10);
      const minWidth = parseInt($width.val(), 10);
      const minHeight = parseInt($height.val(), 10);

      return { searchTerm, likes, minWidth, minHeight };
    },
    reset: () => {
      $searchTerm.val('');
      $numberOfLikes.val($numberOfLikes.data('minLikes'));
      $width.val($width.data('minWidth'));
      $height.val($height.data('minHeight'));
    }
  };
})();

const impureResults = (() => {
  const $results = $('#results');
  const $tip = $('#tip');

  return {
    resetResults: ({ searchTerm, likes, minHeight, minWidth }) => {
      $results.empty();
      $tip.html(`Your results for <strong>${searchTerm}</strong> -> width: ${minWidth}px, height: ${minHeight}px, likes: ${likes} `);
    }
  };
})();

const appendResult = ({ image, tag, likes, width, height }) => {
  $('#results').append(`
    <div class="card">
      <img class="card__image" src="${image}" alt="Card image cap">
      <div class="card__body">
        <p class="card__title">${tag}</p>
        <p class="card__likes">${likes}</p>
        <p class="card__width">${width}</p>
        <p class="card__height">${height}</p>
      </div>
    </div>
  `);
};

$('#submit').on('click', () => {
  const { searchTerm, likes, minHeight, minWidth } = impureDOM.read();

  fetchByTerm(searchTerm)
  .then(prop('hits'))
  .then(filter(hit => hit.likes >= likes))
  .then(filter(hit => hit.webformatHeight >= minHeight))
  .then(filter(hit => hit.webformatWidth >= minWidth))
  .then(hits => {
    impureResults.resetResults(impureDOM.read());
    return hits;
  })
  .then(map(hit => ({
    image: hit.webformatURL,
    tag: hit.tags,
    likes: hit.likes,
    height: hit.webformatHeight,
    width: hit.webformatWidth
  })))
  .then((hits) => {
    console.log('response', hits);

    for(let i = 0; i < hits.length; i++) {
      const hit = hits[i];
      const { image, tag, likes, height, width } = hit;
      appendResult({ image, tag, likes, height, width });
    }
  })
  .then(() => {
    impureDOM.reset();
  });
});
