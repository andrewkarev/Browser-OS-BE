const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');
const getTitle = require('./getTitle');
const prepareItems = require('./prepareItems');

const prepareResponse = async (path) => {
  const itemsList = await fs.readdir(path, { withFileTypes: true });
  const formattedItems = prepareItems(itemsList, path);
  const items = formattedItems.filter((item) => !item.name.startsWith('.'));
  const folderTitle = getTitle(path);

  return {
    id: uuidv4(),
    folderTitle,
    items,
  };
};

module.exports = prepareResponse;
