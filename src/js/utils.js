const exec = require('child_process').exec;

/**
  * Capitalize a word.
  * @param {string} s - The word to capitalize.
  * @return {string} The capitalized word.
  */
const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
  * Minimize a word.
  * @param {string} s - The word to minimize.
  * @return {string} The minimized word.
*/
const minimize = (s) => {
  return s.toLowerCase();
};

/**
  * Clean (remove) HTML tags from a string.
  * @param {string} s - The string to clean.
  * @return {string} The cleaned string.
*/

const cleanHTMLFromString = (html) => {
  return html.replace(/<\/?[^>]+(>|$)/g, '');
};

/**
  * Promisify execution of OS commands.
  * @param {string} command - The command to execute.
  * @return {Promise}
  */
const execPromise = (command) => {
  return new Promise(function(resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        reject(error);
        return;
      }

      resolve(stdout.trim());
    });
  });
};

/**
 * Format at date into YYYY-MM-DD format.
 * @param {string} dt - The date to format.
 * @return {string} The formatted date.
 */
const formatDate = (dt) =>{
  const y = dt.getFullYear();
  const m = ('00' + (dt.getMonth()+1)).slice(-2);
  const d = ('00' + dt.getDate()).slice(-2);
  return (y + '-' + m + '-' + d);
};


module.exports = {
  capitalize,
  minimize,
  cleanHTMLFromString,
  execPromise,
  formatDate,
};
