var gulp = require('gulp'),
    awspublish = require('gulp-awspublish');	
//var mainBowerFiles = require('main-bower-files');
var less = require("gulp-less");


var localConfig = {
  //buildSrc: './build/**/*',
  buildSrc: './dist/**/*',
  getAwsConf: function (environment) {
    //var conf = require('../../config/aws');
	var conf = require('./config/aws');
    if (!conf[environment]) {
      throw 'No aws conf for env: ' + environment;
    }
    if (!conf[environment + 'Headers']) {
      throw 'No aws headers for env: ' + environment;
    }
    return { keys: conf[environment], headers: conf[environment + 'Headers'] };
  }
};

gulp.task('build:production', function() {
	console.log('gulp startttt');	
  var awsConf = localConfig.getAwsConf('production');
  var publisher = awspublish.create(awsConf.keys);
  return gulp.src(localConfig.buildSrc)
    .pipe(awspublish.gzip({ ext: '' }))
    .pipe(publisher.publish(awsConf.headers, {'force':true}))
    //.pipe(publisher.cache())
    .pipe(publisher.sync())
    .pipe(awspublish.reporter());
});


gulp.task('default', function() {
  // place code for your default task here
  console.log("gulp taskkkkk");
});




gulp.task("less", function() {
   gulp.src("app/styles/bootstrap/newbootstrap.less")
       .pipe(less())
       .pipe(gulp.dest("app/styles/"));
});