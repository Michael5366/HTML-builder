const fs = require('fs');
const path = require('path');
const outputPath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(outputPath, { flags: 'a' });
const { stdout, stdin, exit } = process;

output.on('error', (error) => {
  stdout.write(`Error: ${error.message}\n`);
  exit();
});

stdout.write('Please enter your text:\n');

process.on('SIGINT', () => {
  stdout.write('Goodbye!\n');
  exit();
});

stdin.on('data', (data) => {
  const dataStr = data.toString().trim();

  if (dataStr === 'exit') {
    stdout.write('Goodbye!\n');
    exit();
  }

  output.write(dataStr + '\n');

  stdout.write('Please enter your text:\n');
});
