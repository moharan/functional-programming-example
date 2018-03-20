const $ = require('jquery');

const BASE_URL = 'https://pixabay.com/api?key=7449813-3f6b2a4c78c08db391996117d';

const fetchByTerm = (searchTerm, callback) => {
  $.get(BASE_URL + '&q=' + searchTerm, callback);
};

$('#submit').on('click', () => {
  const $searchTerm = $('#searchTerm');
  const $numberOfLikes = $('#numberOfLikes');
  const $width = $('#width');
  const $height = $('#height');

  const searchTerm = $searchTerm.val();
  const likes = parseInt($numberOfLikes.val(), 10);
  const minWidth = parseInt($width.val(), 10);
  const minHeight = parseInt($height.val(), 10);

  fetchByTerm(window.encodeURI(searchTerm), (response) => {
    $('#results').empty();
    console.log('response', response);

    $('#tip').html(`Your results for <strong>${searchTerm}</strong> -> width: ${minWidth}px, height: ${minHeight}px, likes: ${likes} `);

    for(let i = 0; i < response.hits.length; i++) {
      const hit = response.hits[i];

      if (hit.likes >= likes && hit.webformatHeight >= minHeight) {
        const image = hit.webformatURL;
        const tag = hit.tags;
        const likes = hit.likes;
        const height = hit.webformatHeight;
        const width = hit.webformatWidth;

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
      }
    }

    $searchTerm.val('');
    $numberOfLikes.val($numberOfLikes.data('minlike'));
    $width.val($width.data('minWidth'));
    $height.val($height.data('minHeight'));
  });
});