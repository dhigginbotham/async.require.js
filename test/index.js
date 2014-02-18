var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    path = require('path');

app.set('port', 1337);
app.use(express.json());
app.use(express.logger('dev'));
app.use('/js', express.static(path.join(__dirname, '..', 'lib')));
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function (req, res) {
  return res.render('default');
});

app.listen(app.get('port'), function (err) {
  if (!err) console.log('async loader listening on %d', app.get('port'));
});