const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load from frontend/.env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Load from root .env

const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));

const appID = process.env.appID || appJson.appID;
const blockTypeID = process.env.blockTypeID || appJson.blockTypeID;

const projectInfo = {
  appid: appID,
  projectname: appJson.projectName,
  blocks: ['index']
};

const blockInfo = {
  blockTypeID: blockTypeID,
  blockRenderType: 'offlineWeb',
  offlineWebConfig: {
    initialHeight: appJson.contributes.topbar ? appJson.contributes.topbar.initialHeight : undefined,
    initialWidth: appJson.contributes.topbar ? appJson.contributes.topbar.initialWidth : undefined,
    contributes: appJson.contributes
  }
};

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

fs.writeFileSync('dist/project.config.json', JSON.stringify(projectInfo, null, 2));
fs.writeFileSync('dist/index.json', JSON.stringify(blockInfo, null, 2));
console.log(`Successfully generated config for AppID: ${appID}, BlockID: ${blockTypeID}`);
