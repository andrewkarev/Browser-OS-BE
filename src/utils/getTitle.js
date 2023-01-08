const path = require('path');

const getTitle = (itemPath) =>
  itemPath.slice(itemPath.lastIndexOf(path.sep) + 1);

module.exports = getTitle;
