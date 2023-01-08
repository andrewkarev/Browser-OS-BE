const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const os = require('os');
const fs = require('fs/promises');
const { createReadStream, statSync } = require('fs');
const { join, dirname, basename, extname } = require('path');

const prepareItemName = require('./utils/prepareItemName');
const getTitle = require('./utils/getTitle');
const isItemExist = require('./utils/isItemExist');
const prepareResponse = require('./utils/prepareResponse');
const prepareMediaFileStats = require('./utils/prepareMediaFileStats');

router.get('/', async (req, res) => {
  try {
    const { path } = req.query;
    const homeDir = os.homedir();
    const folderPath = path ? path : homeDir;
    const response = await prepareResponse(folderPath);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const { path, operation } = req.query;
    const { title, destPath, itemType } = req.body;
    const homeDir = os.homedir();
    let itemPath = path ? path : homeDir;

    if (operation === 'addFile') {
      let newFilePath = join(itemPath, title);
      newFilePath = await prepareItemName(newFilePath);

      await fs.appendFile(newFilePath, '');
    }

    if (operation === 'addFolder') {
      let newFolderPath = join(itemPath, title);
      newFolderPath = await prepareItemName(newFolderPath);

      await fs.mkdir(newFolderPath);
    }

    if (operation === 'delete') {
      const filePath = itemPath;
      itemPath = dirname(filePath);

      await fs.unlink(filePath);
    }

    if (operation === 'removeFolder') {
      const dirPath = itemPath;
      itemPath = dirname(dirPath);
      await fs.rm(dirPath, { recursive: true, force: true });
    }

    if (operation === 'rename') {
      const oldItemPath = itemPath;
      const dirPath = dirname(itemPath);
      let newItemPath = join(dirPath, title);
      newItemPath = await prepareItemName(newItemPath);
      itemPath = dirPath;

      await fs.rename(oldItemPath, newItemPath);
    }

    if (operation === 'copy') {
      const sourcePath = itemPath;
      let destinationPath = join(destPath, basename(itemPath));
      destinationPath = await prepareItemName(destinationPath);
      itemPath = destPath;

      await fs.cp(sourcePath, destinationPath, { recursive: true });
    }

    if (operation === 'cut') {
      const sourcePath = itemPath;
      let destinationPath = join(destPath, basename(itemPath));
      destinationPath = await prepareItemName(destinationPath);
      itemPath = destPath;

      await fs.cp(sourcePath, destinationPath, { recursive: true });

      itemType === 'file'
        ? await fs.unlink(sourcePath)
        : await fs.rm(sourcePath, { recursive: true, force: true });
    }

    const response = await prepareResponse(itemPath);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/text', async (req, res) => {
  try {
    const { path } = req.query;
    const fileTitle = getTitle(path);
    const isFileExist = isItemExist(path);

    if (isFileExist) {
      const readStream = createReadStream(path);
      const response = { fileTitle, id: uuidv4(), data: '' };

      readStream.on('data', (chunk) => (response.data += chunk));
      readStream.on('end', () => {
        res.status(200).json(response);
      });
    } else {
      res.status(404).end('Resource not found!');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/text', async (req, res) => {
  try {
    const body = req.body;
    const isFileExist = isItemExist(body.filePath);

    if (isFileExist) {
      await fs.writeFile(body.filePath, body.data);

      res.status(200).json(body);
    } else {
      res.status(404).end('Resource not found!');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/getMediaFile', async (req, res) => {
  try {
    const { path } = req.query;
    const fileTitle = getTitle(path);
    const isFileExist = isItemExist(path);

    if (isFileExist) {
      const response = { fileTitle, id: uuidv4(), data: '' };
      res.status(200).json(response);
    } else {
      res.status(404).end('Resource not found!');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/video', (req, res) => {
  try {
    const range = req.headers.range;

    if (!range) {
      res.status(400).send('Requires Range header');
    }

    const { videoPath } = req.query;
    const contentType = 'video';
    const { headers, end, start } = prepareMediaFileStats(
      videoPath,
      range,
      contentType
    );

    res.writeHead(206, headers);
    const videoStream = createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/audio', (req, res) => {
  try {
    const range = req.headers.range;

    if (!range) {
      res.status(400).send('Requires Range header');
    }

    const { audioPath } = req.query;
    const contentType = 'audio';
    const { headers, end, start } = prepareMediaFileStats(
      audioPath,
      range,
      contentType
    );

    res.writeHead(206, headers);
    const videoStream = createReadStream(audioPath, { start, end });
    videoStream.pipe(res);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/image', async (req, res) => {
  try {
    const { imagePath } = req.query;
    const data = await fs.readFile(imagePath);
    const contentExtension = extname(imagePath).slice(1);
    const headers = {
      'Content-Type': `image/${contentExtension}`,
    };

    res.writeHead(200, headers);
    res.end(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
