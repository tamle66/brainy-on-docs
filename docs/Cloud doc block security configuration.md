# Security configuration
## Background note

To **provide better data security**, the new cloud document widget provides security configuration capabilities, including [CSP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP) and **API** permission management. Apps need to apply for resource access permissions, and only after being reviewed by the open platform or tenant administrators can they use the open capabilities of permission binding. In simple terms, API permissions determine which Lark open capabilities an app can use.

## Configuration method

### [CSP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP) request access restriction configuration

1. The CSP capability will block requests from non-domain name Whitelist after it is enabled, which will cause the block to be unusable. Opening the cloud doc console will report the following error
![](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/6b0036ff9da80eaf3bdc823ded08f5d4_XPTd96RyCe.jpeg?lazyload=true&width=3082&height=158)
![](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/5a8447f9943098a6ac7c320f0da5a923_ADegbrVJtq.jpeg?lazyload=true&width=3052&height=164)
2. You need to go to the developer background - security settings - server domain name Whitelist, add server domain name Whitelist, and then release a new version, the review can be passed.
![image.png](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/d4a3256eca44440472f12dcfbdceb775_LPSEvleEEr.png?lazyload=true&width=2750&height=1596)

### Cloud doc block API permission constraint configuration boot

Need to be in the developer background, permission management, select the cloud doc directory, select **[Create and edit a new version of doc] and [View a new version of doc]** Two permission spot bits, grant permission, and publish to submit for review. Applications that do not open the above permission spot bit, the API will not be callable. Description of the correspondence between API and permission spot bit, refer to: [API doc](https://open.larksuite.com/document/uAjLw4CM/uYjL24iN/docs-add-on/05-api-doc/05-api-doc)

![image.png](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/b3a30f882e98818a52cc37b86be1236d_vevYn4vQA2.png?lazyload=true&width=3220&height=1594)