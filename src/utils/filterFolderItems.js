const filterFolderItems = (folderItems) => {
  return folderItems.filter((folderItem) => !folderItem.name.startsWith('.'));
};

module.exports = filterFolderItems;
