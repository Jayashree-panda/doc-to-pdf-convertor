var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload=require('express-fileupload');
var cors=require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var multer=require('multer')
//var fs=require('fs-extra')
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
app.use(fileUpload());
//app.use(busboy())
app.use('/', indexRouter);
app.use('/users', usersRouter);


// var Storage = multer.diskStorage({
//   destination: function(req, file, callback) {
//       callback(null, "./public/docFiles");
//   },
//   filename: function(req, file, callback) {
//       callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
//   }
// });

// var impqwe = multer({
//   storage: Storage
// }).array("imgUploader", 3);
// var storage=multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,'/public/docFiles')
//   },
//   filename:(req,file,cb)=>{
//     cb(null,file.fieldname+'-'+Date.now())
//   }
// })

// var upload=multer({storage:storage})
app.post('/upload',(req,res,next)=>{
  const file=req.files.file
  console.log(file)
  // console.log("req in node"+req)
  // let docFile=req.files.file;
  // //var busboy = new Busboy();
  // // req.busboy.on('file',(fieldname,file,filename)=>{
  // //   console.log("hi")
  // //   console.log("filename"+filename)
  // // })
 file.mv(`${__dirname}/public/docFiles/${file.name}`)
 var cloudconvert=new cloudConvert('PYYOR3eqGkVov6yfi7LIWZGleXIL7nUbMlOkGqNxTKwwRNx9k08ZSdzctSKWQqDr')
 fs.createReadStream('${__dirname}/public/docFiles/${file.name}')
 .pipe(cloudconvert.convert({
   "inputformat":"doc",
   "outputformat":"pdf",
   "input":"upload"
 }))
 .pipe(fs.createWriteStream('${__dirname}/public/docFiles/${file.name}.pdf'))
 console.log("hi")
  // res.send("success")
  // console.log(req.files.file)
  // impqwe(req, res, function(err) {
  //   if (err) {
  //       return res.end("Something went wrong!");
  //   }
  //   return res.end("File uploaded sucessfully!.");

});
// catch 404 and forward to error handler
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
