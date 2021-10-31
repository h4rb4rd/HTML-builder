const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "files");
const copy = path.join(__dirname, "files-copy");

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

copyDir(src, copy);
