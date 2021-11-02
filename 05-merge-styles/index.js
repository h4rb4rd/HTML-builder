const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "styles");
const app = path.join(__dirname, "project-dist");
const bundle = path.join(app, "bundle.css");

function copyStyles(src, app, bundle) {
  fs.readdir(src, (err, files) => {
    err ? console.log(err) : null;

    for (const file of files) {
      if (path.extname(file) == ".css") {
        fs.readFile(path.join(src, file), (err, data) => {
          try {
            fs.appendFile(bundle, data, (err) => {
              err ? console.log(err) : null;
            });
          } catch {
            console.log(err);
          }
        });
      }
    }
  });
}

function createbundle(src, app, bundle) {
  fs.unlink(bundle, (err) => {
    copyStyles(src, app, bundle);
  });
}

createbundle(src, app, bundle);
