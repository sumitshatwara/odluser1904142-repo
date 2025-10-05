import gulp from 'gulp';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import htmlreplace from 'gulp-html-replace';
import { exec } from 'child_process';
import imagemin from 'gulp-imagemin';

// Define paths
const paths = {
  styles: {
    src: 'public/css/**/*.css',
    dest: 'dist/public/css/'
  },
  scripts: {
    src: 'public/js/**/*.js',
    dest: 'dist/public/js/'
  },
  other: {
    src: ['app.js', 'package.json', 'package-lock.json'],
    dest: 'dist/'
  },
  views: {
    src: 'views/**/*.mustache',
    dest: 'dist/views/'
  },
  data: {
    src: 'data/**/*',
    dest: 'dist/data/'
  },
  images: {
    src: 'public/images/**/*',
    dest: 'dist/public/images/'
  },
  dockerfile: {
    src: 'Dockerfile',
    dest: 'dist/'
  }
};

// Clean output directory
async function clean() {
  const del = await import('del');
  return del.deleteAsync(['dist']);
}

// Minify and concatenate CSS files
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(concat('main.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.styles.dest));
}

// Minify and concatenate JS files
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest));
}

// Replace URLs in Mustache templates
function replaceUrls() {
  return gulp.src(paths.views.src)
    .pipe(htmlreplace({
      'css': '/css/main.min.css',
      'js': '/js/main.min.js'
    }))
    .pipe(gulp.dest(paths.views.dest));
}

// Copy other files
function copyOther() {
  return gulp.src(paths.other.src)
    .pipe(gulp.dest(paths.other.dest));
}

// Copy views
function copyViews() {
  return gulp.src(paths.views.src)
    .pipe(gulp.dest(paths.views.dest));
}

// Copy data
function copyData() {
  return gulp.src(paths.data.src)
    .pipe(gulp.dest(paths.data.dest));
}

// Copy images with minimal processing to avoid corruption
function copyImages() {
  return gulp.src(paths.images.src, { encoding: false })
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest))
    .on('error', function (err) {
      console.error('Error in copyImages task', err.toString());
    });
}

// Copy Dockerfile
function copyDockerfile() {
  return gulp.src(paths.dockerfile.src)
    .pipe(gulp.dest(paths.dockerfile.dest));
}

// Install dependencies in the dist folder
function npmInstall(cb) {
  exec('npm install', { cwd: 'dist' }, (err, stdout, stderr) => {
    if (err) {
      console.error(`npmInstall error: ${err}`);
      return cb(err);
    }
    console.log(stdout);
    console.error(stderr);
    cb();
  });
}

// Build Docker image
function dockerBuild(cb) {
  console.log('Building Docker image...');
  exec('docker build -t prime-website .', { cwd: 'dist' }, (err, stdout, stderr) => {
    if (err) {
      console.error(`dockerBuild error: ${err}`);
      return cb(err);
    }
    console.log(stdout);
    console.error(stderr);
    cb();
  });
}

// Run Docker container
function dockerRun(cb) {
  console.log('Running Docker container...');
  exec('docker run -d -p 3000:3000 --name prime-website prime-website', (err, stdout, stderr) => {
    if (err) {
      console.error(`dockerRun error: ${err}`);
      return cb(err);
    }
    console.log(stdout);
    console.error(stderr);
    cb();
  });
}

// Stop Docker container
function dockerStop(cb) {
  exec('docker stop prime-website', (err, stdout, stderr) => {
    if (err) {
      console.error(`dockerStop error: ${err}`);
      return cb(err);
    }
    console.log(stdout);
    console.error(stderr);
    cb();
  });
}

// Remove Docker container
function dockerRemoveContainer(cb) {
  exec('docker rm prime-website', (err, stdout, stderr) => {
    if (err) {
      console.error(`dockerRemoveContainer error: ${err}`);
      return cb(err);
    }
    console.log(stdout);
    console.error(stderr);
    cb();
  });
}

// Remove Docker image
function dockerRemoveImage(cb) {
  exec('docker rmi prime-website', (err, stdout, stderr) => {
    if (err) {
      console.error(`dockerRemoveImage error: ${err}`);
      return cb(err);
    }
    console.log(stdout);
    console.error(stderr);
    cb();
  });
}

// Stop and Remove Containers and Images
const dockerClean = gulp.series(dockerStop, dockerRemoveContainer, dockerRemoveImage);

// Define complex tasks
const build = gulp.series(clean, gulp.parallel(styles, scripts, copyOther, replaceUrls, copyData, copyImages, copyDockerfile), npmInstall);
const docker = gulp.series(build, dockerBuild, dockerRun);
// Export tasks
export { clean, styles, scripts, copyOther, replaceUrls, copyData, copyImages, copyDockerfile, npmInstall, build, dockerBuild, dockerRun, dockerStop, dockerRemoveContainer, dockerRemoveImage, dockerClean, docker, build as default };
