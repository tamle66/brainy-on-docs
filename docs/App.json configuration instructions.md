# Component configuration
App.json is the configuration file for the doc block.
- You can configure ` contributes  `to display subsidiary views.
- You can configure ` environments  `to configure different environments
## Subsidiary view configuration

- The component type and subsidiary view are configured by the field ` contributes  `. The relevant configuration instructions are as follows:
- 

Field name | Type | Description | Example
---|---|---|---
addPanel | object | **[Component type] Body block**
∟ view | string | The block renders the page entry (usually referring to the html entry) | index.html
∟ initialHeight | number | Initial height of the block container | 200
∟ useHostLoading | boolean | Whether to use doc's Loading animation, with ` notifyAppReady  `use | true
∟ useInteraction | boolean | Whether to use Interaction to store data | true
topbar | object | **[Component Type] Floating block** | topbar.html
∟ view | string | The block renders the page entry (usually referring to the html entry)
∟ initialHeight | number | Initial height of the block container | 200
∟ initialWidth | number | The initial width of the block container | 800
∟ useHostLoading | boolean | Whether to use doc's Loading animation, with ` notifyAppReady  `use | true
∟ resizeType | string | Resize type, only fields in the example can be passedMobile end does not support resize, pass any field here is'none ' | - Free: Free to resize and scale the application at will<br>- Proportional: resize proportionally, only diagonally and proportionally<br>- Horizontal: resize horizontally, it can only be scaled horizontally<br>- Vertical: resize vertically, scaling only vertically<br>- None: cannot be scaled
∟ align | string | Default alignment method, if the block needs to be wider than the doc body width, it needs to be set to the default center alignment; changing the alignment method does not provide an api for the time being, only the default alignment method setting is provided. | - Left: Align left<br>- Center: center alignment<br>- Right: right alignment
fullscreen | object | **[Affiliate view] Full screen view** , the application calls [Service.Fullscreen.enterFullscreen](https://open.larksuite.com/document/uAjLw4CM/uYjL24iN/docs-add-on/05-api-doc/basic-data-reference---base/Service.Fullscreen.enterFullscreen) to evoke
∟ view | string | View rendering page entry (usually refers to the html entry) | fullscreen.html
floatCard | object | **[Affiliate view] floating card view** , application calls [Service.FloatCard.enterFloatCard](https://open.larksuite.com/document/uAjLw4CM/uYjL24iN/docs-add-on/05-api-doc/basic-data-reference---base/Service.FloatCard.enterFloatCard)evokes
∟ view | string | View rendering page entry (usually refers to the html entry) | floatCard.html
∟ initialHeight | number | Initial height of the block container | 200
popup | string | **[Affiliate view] pop-up view** , application call [View.Action.showPopup](https://open.larksuite.com/document/uAjLw4CM/uYjL24iN/docs-add-on/05-api-doc/basic-data-reference---base/View.Action.showPopup)evokes
∟ view | string | View rendering page entry (usually refers to the html entry) | popup.html
∟ initialHeight | number | Initial height of the block container | 200
modal | string | **[Affiliate view]** **modal** **box view** , the application calls [View.Action.openModal](https://open.larksuite.com/document/uAjLw4CM/uYjL24iN/docs-add-on/05-api-doc/basic-data-reference---base/View.Action.openModal)to evoke
∟ view | string | View rendering page entry (usually refers to the html entry) | modal.html
∟ initialHeight | number | Initial height of the block container | 200

## Multi-application configuration
During development, a set of project projects needs to be released to both ` test  `and ` formal  `environments, and different environments correspond to the AppID and BlockTypeID of different applications. Using ` environments  `can configure application configuration information for each environment at the same time. Currently only two environments are supported: ` Lark  `( Lark formal environment) and ` feishu-boe  `(Lark testing environment).
| Key         | Type   | Description    | Reference value               |
| ----------- | ------ | -------------- | ----------------------------- |
| appID       | string | Application ID | cli_a268846eae22****          |
| blockTypeID | string | Block ID       | blk_62e238730f1a001c9167**** |
**Example code**
```json
{
  "manifestVersion": 1,
  "appID": "cli_a33d20ce6eb8****",
  "appType": "docs-addon",
  "blockTypeID": "blk_63b79cd3cf80000150d6****",
  "projectName": "Docsaddon-Demo",
  "contributes": {
    "addPanel": {
      "initialHeight": 46,
      "view":"index.html",
    }
  },
  "environments": {
    "feishu-boe": {
      "appID": "cli_a250c5077538****",
      "blockTypeID": "blk_62f5f715130000138d90****"
    }
  }
}
```