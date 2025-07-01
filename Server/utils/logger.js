const chalk = require('chalk');

const log = {
  info: (msg) => console.log(chalk.hex('#005498')(`[INFO] ${msg}`)),       // Custom blue
  success: (msg) => console.log(chalk.hex('#44ebd4')(`[SUCCESS] ${msg}`)), // Emerald green
  warn: (msg) => console.log(chalk.hex('#f1c40f')(`[WARN] ${msg}`)),       // Amber
  error: (msg) => console.log(chalk.hex('#e74c3c')(`[ERROR] ${msg}`)),     // Crimson red
  debug: (msg) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(chalk.hex('#9b59b6')(`[DEBUG] ${msg}`));                 // Orchid purple
    }
  },
};

module.exports = log;

