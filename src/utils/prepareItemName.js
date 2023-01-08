const isItemExist = require('./isItemExist');

const prepareItemName = async (name) => {
  const isfileExist = await isItemExist(name);

  if (!isfileExist) return name;

  const isFirstCopy = !/[()]/.test(name);
  const dotIndex = name.lastIndexOf('.');
  let output = name;

  if (!isFirstCopy) {
    const copyCounterIndex = output.indexOf('(') + 1;
    const copyCounter = Number(output[copyCounterIndex]);

    return `${output.slice(0, copyCounterIndex)}${
      copyCounter + 1
    }${output.slice(copyCounterIndex + 1)}`;
  }

  const newName =
    dotIndex !== -1
      ? `${output.slice(0, dotIndex)}(1)${output.slice(dotIndex)}`
      : `${output}(1)`;

  return await prepareItemName(newName);
};

module.exports = prepareItemName;
