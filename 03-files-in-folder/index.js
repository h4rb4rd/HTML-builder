const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "secret-folder");

function filesInFolder(dir) {
  fs.readdir(dir, (err, files) => {
    err ? console.log(err) : null;

    for (const file of files) {
      const filePath = path.join(dir, file);

      fs.stat(filePath, (err, stats) => {
        err ? console.log(err) : null;

        if (stats.isFile()) {
          console.log(
            `${path.parse(file).name} ${
              path.extname(file) && `- ${path.extname(file).slice(1)}`
            } - ${(stats.size / 1024).toFixed(3)}kb`
          );
        } else {
          filesInFolder(path.join(dir, file));
        }
      });
    }
  });
}

filesInFolder(dir);
