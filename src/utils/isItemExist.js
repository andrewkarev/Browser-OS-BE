const { access } = require('fs/promises');

const isItemExist = async (path) => {
  try {
    await access(path);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = isItemExist;
