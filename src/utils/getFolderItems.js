const fs = require('fs/promises');

const getFolderItems = async (path) => {
  const items = await fs.readdir(path, {
    withFileTypes: true,
  });

  return items;
};

module.exports = getFolderItems;
