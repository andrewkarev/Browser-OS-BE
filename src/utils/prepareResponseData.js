const { v4: uuidv4 } = require('uuid');

const prepareResponseData = (items, folderTitle) => {
  return {
    id: uuidv4(),
    folderTitle,
    items,
  };
};

module.exports = prepareResponseData;
