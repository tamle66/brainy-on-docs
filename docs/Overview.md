# Get started quickly
## Create widget

### Install developer tools

> - If you have installed the developer tools, please execute ` npm uninstall @bdeefe/opdev-cli -g  `to clean up the environment first, and then use the installation package to install it to avoid overwriting the path.
> - Installation using the command line requires Node.js . Please refer to [Node.js for ](https://nodejs.org/)the installation method. When installing Node.js, npm will be automatically installed.
> - Opdev For more command operations, see: [Lark Developer Tools - Command Line - Development Document - Lark Open Platform](https://open.larksuite.com/document/no_class/feishu-developer-tool---command-line#59e404d7)
```
npm install @lark-opdev/cli@latest -g

npm uninstall @bdeefe/opdev-cli -g

# Verify that the installation was successful

opdev help
```

### Log in to your account

1. After the installation is successful, execute the following command and follow the prompts to log in on the login page that opens:
```
$ opdev login
```
2. Select Development Environment, here select Lark Development Environment
![](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/16e8c8eb41aa74233742d45d71d95eab_DWMBmdC2Dv.png?lazyload=true&width=1952&height=320)
3. After selecting Development Environment, the browser will automatically start to jump to the login page to log in. After the login is successful, execute ` opdev login  `again and you will see the following output:
![](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/62266c6f30a418b379f46881ed44bfc6_2UuLi71nXx.png?lazyload=true&width=2634&height=350)

### Creating a project

Execute the following command at the command line end point to create the sample project:
```
$ opdev create [FolderName]
// Example
$ opdev create demo
```

### Select component type

Select docs-addon here
![](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/0d738c3fb4b3a68ad5d608598615c3ef_LBoRJiqqGF.png?lazyload=true&width=1686&height=244)

### Create a cloud doc block

Enter the Enter key, and the cloud document widget will be created automatically. You can click the link of the console to access the developer console to view the information about the cloud document widget created by the system.
![image.png](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/2b97c64dedadb99b08d90fed2279ae09_6xy7KbtTqz.png?lazyload=true&width=1280&height=166)

![image.png](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/01087351e2f7ad2d15d5a089ffe006c0_rOlyum5YmM.png?lazyload=true&width=2040&height=1008)

![image.png](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/c7ab0631846e6b137834564885c898c8_ex9hXMkZKT.png?lazyload=true&width=2200&height=1062)

### Sample block introduction

This block allows you to insert the Mermaid charting tool into documents, enabling you to create complex diagrams such as flowcharts and sequence diagrams with a few lines of text (code).
![image.png](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/09edcdcb1ffd286fdf25f9ea8b843429_sa6jzhZ4zy.png?lazyload=true&width=1770&height=684)
```
├── README.md
├── app.json
├── node_modules
├── package.json
├── src
├── tsconfig.json
└── webpack.config.js
```
## Debug block

Enter the project root directory, install dependencies, and start the project:
```
cd demo

npm i
npm start
```
In the open test page , you can insert the sample block through the menu (the local block name is blockTypeID)
![image.png](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/0558195ec93fd1f711a92133d6ebdca5_VK4fdOm095.png?lazyload=true&width=1104&height=808)
## Upload block

Execute the following command in the command line end point, and follow the prompts to complete the release of the applet.
```
npm run upload
```
![](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/8eea5eeed36ebc7e411262fb01456c57_123F8JXWhX.png?lazyload=true&width=1960&height=510)
## Publish block

1. ![image.png](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/51a9e1aed45ec20ca27de64ec84f5322_GUOK0WjxJS.png?lazyload=true&width=2338&height=1124)
2. Then in the app release column, create a version release
![image.png](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/85eafb3b97a850cf445aabbd7e21d8d0_QMhfYVUF4U.png?lazyload=true&width=3486&height=1340)
3. After the version is created, apply for online release, and then review by the 
![image.png](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/628c9dc4d3ddea63c57c8e3c2188ea4e_XbSjxS29rr.png?lazyload=true&width=2956&height=902)background administrator. After the review is passed, the release is complete.

## Block Internationalization Configuration

Block Internationalization configuration allows you to display the corresponding block name and description in different locales after your block is published.
To enable the Internationalization configuration, go to Open Platform - Credentials and Basic Information - Internationalization Configuration and add different language names and app descriptions.
![image.png](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/011f1039f4d234763d13410e31df78cf_OndQAGnqfR.png?lazyload=true&width=2040&height=1236)
Then, add the basic information configuration of the block in different languages to your block and publish it to complete the block Internationalization configuration.
![image.png](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/6d88efd122f2a33a927a373a96f0c5b2_eZ3qQM0qrT.png?lazyload=true&width=2286&height=1390)
In-App Internationalization can combine your technology selection and choose the right solution (such as [react-i18next ](https://react.i18next.com/))

We provide the corresponding interface to get the language of the current user: 
[Env.Language.getLanguage](https://open.larksuite.com/document/uAjLw4CM/uYjL24iN/docs-add-on/05-api-doc/basic-data-reference---base/Env.Language.getLanguage)
## Block configuration instructions

### Project configuration

The project configuration is located in ` app.json  `under the project root directory, which mainly contains the following configuration :
| Field name      | Type                            | Description                                                                             | Example                                                  |
| --------------- | ------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| manifestVersion | number                          | Manifest version                                                                        | 1                                                        |
| appID           | string                          | App ID, obtained from Lark Open Platform                                              | cli_a33d20ce6eb8****                                     |
| blockTypeID     | string                          | blockTypeID, obtained after the block capability is enabled in the Lark Open Platform | blk_63b79cd3cf80000150d6****                            |
| contributes     | Record<string, ContributeInfo> | Component Type & Affiliate View Configuration                                           | {"addPanel": {"initialHeight": 46,"view": "index.html"}} |
| projectName     | string                          | Block name                                                                              | Docsaddon-Demo                                           |
For more configuration , please refer to [App.json configuration instructions](https://open.larksuite.com/document/uAjLw4CM/uYjL24iN/docs-add-on/03-cloud-doc-block-rapid-development-guide/appjson-configuration-instructions).

## Security configuration (required, otherwise it will affect the normal use of widgets)
Refer to [Security Configuration Instructions](https://open.larksuite.com/document/uAjLw4CM/uYjL24iN/docs-add-on/08-cloud-doc-block-security-configuration/cloud-doc-block-security-configuration)
## Open Source Sample Code Reference
[read data](https://github.com/docsaddon/page-viewers)