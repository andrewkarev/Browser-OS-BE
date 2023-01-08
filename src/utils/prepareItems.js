const path = require('path');

const prepareItems = (items, folderPath) => {
  const preparedItems = items.map((item) => {
    const isFile = item.isFile();
    const itemName = item.name;
    const itemPath = path.resolve(folderPath, itemName);

    return {
      name: itemName,
      type: isFile ? 'file' : 'directory',
      extension: isFile ? path.extname(itemPath) : null,
      path: itemPath,
    };
  });

  return preparedItems;
};

module.exports = prepareItems;
