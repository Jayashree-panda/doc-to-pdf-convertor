var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors=require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var multer = require('multer')
var storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
var upload = multer({
  storage: storage
})

var cloudConvert=require('cloudconvert')
var fs=require('fs')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/upload', upload.single('file'), (req, res, next) => {
  const path = req.file.path
  var convert = new cloudConvert('PYYOR3eqGkVov6yfi7LIWZGleXIL7nUbMlOkGqNxTKwwRNx9k08ZSdzctSKWQqDr')

  console.log(convert)

  convert.createProcess({
    "inputformat": "docx",
    "outputformat": "pdf"
  }, (process) => {
    console.log(process)
    process.start({
      "wait": true,
      "input": "upload"
    })
    process.upload(fs.createReadStream(path))
    process.wait(callback)
    console.log(process.data.message)
  })
})

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app
