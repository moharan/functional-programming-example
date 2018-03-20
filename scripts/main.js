const $ = require('jquery');
const { prop, filter, map, forEach, compose } = require('./function-utils');

const BASE_URL = 'https://pixabay.com/api?key=7449813-3f6b2a4c78c08db391996117d';

const fetchByTerm = searchTerm => $.get(`${BASE_URL}&q=${encodeURI(searchTerm)}`);

const impureDOM = (() => {
  const $searchTerm = $('#searchTerm');
  const $numberOfLikes = $('#numberOfLikes');
  const $width = $('#width');
  const $height = $('#height');
  const $results = $('#results');
  const $tip = $('#tip');

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
    },
    renderResults: ({ searchTerm, likes, minHeight, minWidth }) => {
      $results.empty();
      $tip.html(`Your results for <strong>${searchTerm}</strong> -> width: ${minWidth}px, height: ${minHeight}px, likes: ${likes} `);
    },
    appendResult: ({ image, tag, likes, width, height }) => {
      $results.append(`
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
    }
  };
})();

const transformHit = hit => ({
  image: hit.webformatURL,
  tag: hit.tags,
  likes: hit.likes,
  height: hit.webformatHeight,
  width: hit.webformatWidth
});

$('#submit').on('click', () => {
  const { searchTerm, likes, minHeight, minWidth } = impureDOM.read();

  fetchByTerm(searchTerm)
    .then(prop('hits'))
    .then(compose(
      filter(hit => hit.likes >= likes),
      filter(hit => hit.webformatHeight >= minHeight),
      filter(hit => hit.webformatWidth >= minWidth)
    ))
    .then(hits => {
      impureDOM.renderResults(impureDOM.read());
      return hits;
    })
    .then(map(transformHit))
    .then((hits) => {
      console.log('response', hits);
      return hits;
    })
    .then(forEach(impureDOM.appendResult))
    .then(() => {
      impureDOM.reset();
    });
});
