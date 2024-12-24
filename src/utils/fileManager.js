const fs = require('fs').promises;
const path = require('path');

const readFile = async (filename) => {
  const filePath = path.join(__dirname, '../../data', filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeFile = async (filename, content) => {
  const filePath = path.join(__dirname, '../../data', filename);
  await fs.writeFile(filePath, JSON.stringify(content, null, 2));
};

module.exports = { readFile, writeFile };