const filterFolderItems = require('./filterFolderItems');
const getFolderItems = require('./getFolderItems');
const getTitle = require('./getTitle');
const prepareItems = require('./prepareItems');
const prepareResponseData = require('./prepareResponseData');

const prepareResponse = async (path) => {
  const items = await getFolderItems(path);
  const formattedItems = prepareItems(items, path);
  const filteredItems = filterFolderItems(formattedItems);
  const folderTitle = getTitle(path);

  return prepareResponseData(filteredItems, folderTitle);
};

module.exports = prepareResponse;
