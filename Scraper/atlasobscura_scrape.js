const Xray = require('x-ray'),
  x = Xray(),
  fs = require('fs')


const getPlaces = () => {
  var fileName = 'places',
    url = 'http://www.atlasobscura.com/places'

  x(url, '.equal-height-columns > *', [{
      link: '.content-card@href',
      name: '.place-card-location',
      subName: 'span.title-underline',
      subTitle: '.content-card-subtitle',
      src: 'img@data-src'
    }])
    .paginate('a[rel="next"]@href')
    .write('results.json')
}

getPlaces()
