const chalk = require('chalk');

function getCallSite() {
  const stack = new Error().stack.split('\n');
  // stack[0] = "Error"
  // stack[1] = getCallSite (this fn)
  // stack[2] = the log.info/error/etc call inside logger
  // stack[3] = the actual caller we want
  const callerLine = stack[3] || '';

  // Extract file path and line number from the stack frame
  // Handles both "at Object.<anonymous> (/path/to/file.js:12:5)"
  // and "at /path/to/file.js:12:5"
  const match = callerLine.match(/\((.+):(\d+):(\d+)\)/) ||
                callerLine.match(/at (.+):(\d+):(\d+)/);

  if (!match) return '';

  const fullPath = match[1];
  const line     = match[2];

  // Trim to relative path from project root (everything after /server/ or /client/)
  const relative = fullPath.replace(/.*[\/\\]Server[\/\\]/, 'server/').replace(/\\/g, '/');

  return chalk.hex('#080e87')(` › ${relative}:${line}`);
}


const log = {
  info: (msg) => console.log(chalk.hex('#005498')(`[INFO] ${msg}`) + getCallSite()),       
  success: (msg) => console.log(chalk.hex('#44ebd4')(`[SUCCESS] ${msg}`) + getCallSite()), 
  warn: (msg) => console.log(chalk.hex('#f1c40f')(`[WARN] ${msg}`) + getCallSite()),       
  error: (msg) => console.log(chalk.hex('#e74c3c')(`[ERROR] ${msg}`) + getCallSite()),     
  debug: (msg) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(chalk.hex('#9b59b6')(`[DEBUG] ${msg}`) + getCallSite());                 
    }
  },
};

module.exports = log;

