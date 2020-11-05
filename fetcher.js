const fs = require("fs");
const request = require('request');
const readline = require("readline");

const args = process.argv.slice(2);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const printFileSize = () => {
  const stats = fs.statSync(`${args[1]}`);
  const fileSizeInBytes = stats['size'];
  return `Downloaded and saved ${fileSizeInBytes} to ${args[1]}`;
};


request(`${args[0]}`, (error, response, body) => {
  if (error) {
    console.log(error.code);
    process.exit();
  } else if (response.statusCode !== 200) {
    console.log(response.statusCode);
    process.exit();
  } else {
    fs.access(`${args[1]}`, fs.F_OK, (err) => {
      if (!err) {
        rl.question("The file name already exists. Please input 'Y' (followed by the enter key) if you would like to overwrite this file: ", (answer) => {
          if (answer === 'Y') {
            fs.writeFile(`${args[1]}`, body, 'utf8', (err) => {
              if (err) throw err;
              printFileSize();
            });
          }
          rl.close();
        });
      } else {
        fs.writeFile(`${args[1]}`, body, 'utf8', (err) => {
          if (err) throw err;
          printFileSize();
        });
      }
    });
  }
});