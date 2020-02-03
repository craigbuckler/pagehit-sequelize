// main application

'use strict';

const
  // default HTTP port
  port = 3000,

  // express
  express = require('express'),
  app = express(),

  // page counter object
  pagehit = new (require('./lib/pagehit'))();


// header middleware
app.use((req, res, next) => {

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'must-revalidate, max-age=0'
  });
  next();

});

// page count middleware
app.use(async (req, res, next) => {

  // get hit count
  req.count = await pagehit.count(req);

  if (req.count) {
    next();
  }
  else {
    res.status(400).send('No referrer');
  }

});

// JSON response
app.get('/counter.json', (req, res) => {
  res.json({ counter: req.count });
});

// JavaScript document.write() response
app.get('/counter.js', (req, res) => {

  res
    .set('Content-Type', 'application/javascript')
    .send(`document.write('<span class="pagecounter">${req.count}</span>');`);

});

// JavaScript deferred DOM update response
app.get('/counter-defer.js', (req, res) => {

  res
    .set('Content-Type', 'application/javascript')
    .send(`window.addEventListener('DOMContentLoaded',()=>{let c=document.querySelectorAll('script[src$="/counter-defer.js"]');for(let i=0;i<c.length;i++) c[i].insertAdjacentHTML('afterend','<span class="pagecounter">${req.count}</span>');
        });`);

});

// SVG response
app.get('/counter.svg', (req, res) => {

  res
    .set('Content-Type', 'image/svg+xml')
    .send(`<svg xmlns="http://www.w3.org/2000/svg" width="${String(req.count).length * 0.6}em" height="1em"><style>text { font-family: sans-serif; font-size: 1em; dominant-baseline: middle; }</style><text y="50%">${req.count}</text></svg>`);

});

// start HTTP server
app.listen(port, () =>
  console.log(`page hit web service running on port ${port}`)
);
