// Include fs module
const fs = require('fs');
const copyFromDir = __dirname + '/../dist';
const files = ['main.js', 'main.js.zip', 'index.html', 'main.css'];
// const copyToDir = __dirname+'/../../'+'buildCpp';
const copyToDir = __dirname + '/../../Include';

files.forEach((file) => {
  // Use fs.readFile() method to read the file
  fs.readFile(copyFromDir + '/' + file, 'utf8', function (err, data) {
    // console.log(data);
    const filename = file.replace(/\./g, '_');
    const headerFilename = filename + '_H';
    const payload = `
      #ifndef ${headerFilename}
      #define ${headerFilename}
      const char ${filename}[] PROGMEM = R"rawliteral(
          ${data}
          )rawliteral";
          #endif
      `;
    if (!fs.existsSync(copyToDir)) {
      fs.mkdirSync(copyToDir, () => {});
    }
    fs.writeFile(copyToDir + '/' + filename + '.h', payload, (err) => {
      if (err) console.log(err);
      else console.log('Copied file: ', copyToDir + '/' + filename);
    });
  });
});
