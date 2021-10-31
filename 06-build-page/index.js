const fs = require("fs");
const path = require("path");

const src = path.dirname(__filename);
const app = path.join(src, "project-dist");

const template = path.join(src, "template.html");
const components = path.join(src, "components");

const styles = path.join(src, "styles");
const cssBundle = path.join(app, "style.css");

const assets = path.join(src, "assets");
const assetsBundle = path.join(app, "assets");

// html
function copyHtml(template, components) {
  fs.readFile(template, "utf8", (err, template) => {
    err ? console.log(err) : null;

    let html = template;

    fs.readdir(components, (err, files) => {
      err ? console.log(err) : null;

      for (const file of files) {
        if (path.extname(file) == ".html") {
          let tag = file.split(".")[0];
          const re = new RegExp(`{{${tag}}}`);

          fs.readFile(path.join(components, file), "utf8", (err, data) => {
            err ? console.log(err) : null;

            html = html.replace(re, data);

            fs.writeFile(path.join(app, "index.html"), html, (err) => {
              err ? console.log(err) : null;
            });
          });
        }
      }
    });
  });
}

// styles
function copyStyles(src, bundle) {
  fs.readdir(src, (err, files) => {
    err ? console.log(err) : null;

    for (const file of files) {
      if (path.extname(file) == ".css") {
        fs.readFile(path.join(src, file), (err, data) => {
          err ? console.log(err) : null;

          fs.appendFile(bundle, data, (err) => {
            err ? console.log(err) : null;
          });
        });
      }
    }
  });
}

function createCssbundle(src, bundle) {
  fs.unlink(bundle, (err) => {
    copyStyles(src, bundle);
  });
}

// assets
function copyFiles(src, copy) {
  fs.readdir(src, (err, files) => {
    err ? console.log(err) : null;

    for (const file of files) {
      const filePath = path.join(src, file);

      fs.stat(filePath, (err, stats) => {
        err ? console.log(err) : null;

        if (stats.isFile()) {
          fs.copyFile(path.join(src, file), path.join(copy, file), (err) => {
            console.log(`file: ${file} was copied to ${path.join(copy, file)}`);
          });
        } else {
          fs.mkdir(path.join(copy, file), { recursive: true }, (err) => {
            err ? console.log(err) : null;
            copyFiles(path.join(src, file), path.join(copy, file));
          });
        }
      });
    }
  });
}

function copyDir(src, copy) {
  fs.access(copy, (err) => {
    if (err) {
      fs.mkdir(copy, { recursive: true }, () => {
        copyFiles(src, copy);
      });
    } else {
      fs.rm(copy, { recursive: true }, (err) => {
        err ? console.log(err) : null;
        fs.mkdir(copy, { recursive: true }, () => {
          copyFiles(src, copy);
        });
      });
    }
  });
}

// build page
fs.mkdir(app, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }

  // html
  copyHtml(template, components);

  // css
  createCssbundle(styles, cssBundle);

  // assets
  copyDir(assets, assetsBundle);
});
