// core module
const path = require('path');

// npm modules
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// console.log(__dirname);
// console.log(path.join(__dirname, '../public'));

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');


// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);


// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Thanh Tran'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About me',
    name: 'Thanh Tran'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    helpText: 'This is some helpful text.',
    name: 'Thanh Tran'
  })
})

// app.com
// app.com/help
// app.com/about
// app.com/weather
// => routes

// => No longer serves a purpose
// app.get('', (req, res) => {
//   res.send('<h1>Weather</h1>');
// });

// => Same
// app.get('/help', (req, res) => {
//   res.send([{
//     name: 'Andrew',
//     age: 27
//   }, {
//     name: 'Sarah'
//   }]);
// });

// app.get('/about', (req, res) => {
//   res.send('<h1>About</h1>');
// })


// serves JSON
app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address'
    })
  }

  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error })
    }

    forecast(latitude, longitude, (error, forecastData ) => {
      if (error) {
        return res.send({ error })
      }

      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      })
    })
  })

  // res.send({
  //   forecast: 'It is snowing',
  //   location: 'Paris',
  //   address: req.query.address
  // });
})

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term'
    })
  }

  console.log(req.query.search);
  res.send({
    products: []
  });
});

app.get('/help/*', (req, res) => {
  // res.send('Help article not found');
  res.render('404', {
    title: '404',
    name: 'Thanh Tran',
    errorMessage: 'Help article not found.'
  })
})

// * is a wild card character
app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Thanh Tran',
    errorMessage: 'Page not found.'
  });
  // res.send('My 404 page');
})

// req is short for request, res for response

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});

// starts up the server
