# Data storage
## Introduction to doc storage service

The cloud doc block provides powerful data storage services. In addition to conventional data storage services, it also integrates collaborative solutions. The storage service also has a high degree of fit with the doc as a whole, and the data changes the operation logic of the doc, such as: data can be restored through historical records.

## Usage scenario description

We provide two data storage solutions, namely "doc data" and "interactive data". The two are consistent in storage capacity, but there are differences in permissions and functional features. Developers can choose the required storage according to different business scenarios . Serve.

### Scenario 1. Class voting scenario

Scenarios that need to record user operation behavior, such as the "information collection" and "voting" functions in the cloud doc, the data of the configuration class needs to use "doc data" or "interactive data", but the user **must** use "interactive data" when clicking Tabular Data, Because "doc data" requires the current user to have write permission, and voting can also be performed with view permission.

### Scenario 2. Text editing type scenario

For text editing type scenarios, it is recommended to use "doc data" for storage. "doc data" is naturally connected to the undo/redo and history records of cloud docs, making editing behavior closer to doc operations.
![image.png](//sf16-sg.larksuitecdn.com/obj/open-platform-opendoc-sg/3a772e78b954ac8c38b6a83fcf31847a_wGyV0qzJdx.png?lazyload=true&width=2644&height=1250)

### Scenario 3. You need to customize copy and paste data.

The data copy strategy of "doc data" and "interactive data" is different. If you want to copy the same before and after, then you need to use "doc data". If you want the data to be cleared after copying, "interactive data" is your choice.

### How to choose the services you need

Often in real scenarios, "doc data" and "interactive data" are mixed, and the key decision points are determined according to the demand scenario. As in the scenario we gave above, some data can use any storage service, and voting actions must use "interactive data".

## Feature details

| Storage service name         | Doc data                                                                                                            | Interactive data                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Corresponding API            | [Record](https://open.larksuite.com/document/uAjLw4CM/uYjL24iN/docs-add-on/05-api-doc/basic-data-reference---base/Record.getRecord)                                       | [Interaction](https://open.larksuite.com/document/uAjLw4CM/uYjL24iN/docs-add-on/05-api-doc/basic-data-reference---base/Interaction.getData)                                       |
| Supported component types    | -   Body block & its subsidiary views - [see details](https://open.larksuite.com/document/uAjLw4CM/uYjL24iN/docs-add-on/02-cloud-doc-block-noun-explanation) | -   Body block & its subsidiary views - [see details](https://open.larksuite.com/document/uAjLw4CM/uYjL24iN/docs-add-on/02-cloud-doc-block-noun-explanation) |
| Data volume                  | 500KB                                                                                                               | 500KB                                                                                                               |
| Synergy ability              | Support                                                                                                             | Support                                                                                                             |
| Conflict resolution capacity | Support                                                                                                             | Support                                                                                                             |
| Permission requirements      | Requires the current user to have doc edit permission                                                               | Unconstrained                                                                                                       |
| Support history restore      | Support                                                                                                             | Does not support                                                                                                    |
| Support body undo/redo       | Support                                                                                                             | Does not support                                                                                                    |
| Data copying behavior        | Data deep copy, see the following copy behavior description section                                                 | Clear data                                                                                                          |

### Replication behavior description

In particular, the data copying behavior is described. When "doc data" copies data, it creates a new data entity and copies the data back to the new data entity; the following is an example of pseudo-code .
```js
originData = {
    record_id: 'origin_id',
    data: { 
        config: { color: 'red', time: '2023-1-18' }
    }
} 
```
After we copy and paste the original data, it will look like the following
```js
cloneData = {
    record_id: 'clone_origin_id',
    data: {
        config: { color: 'red', time: '2023-1-18' }
    }
} 
```

### How to use synergy

> Here "doc data" is used to illustrate Developers do not need to pay attention to the underlying collaborative algorithm. Developers can tell the doc data how to operate according to the API transmission parameter format. The following is a simple description of the pseudo-code , the collaborative use and the collaborative effect.

**Step1.** Assume that the application stores a version number of 1 data block in A doc; ` data = {root: {a: 1, b: 1}}  `;

**Step2.** There is a user Xiaoming, in the version number of 1 data block submitted a data update operation; in the root object **new c = 1 data** ; pseudo code is as follows:
```js
DocMiniApp.Record.setRecord([
    {
      type: 'insert',
      data: {
        path: ['root', 'c' ],
        value: 1
      }
    }
  ]);
```

**Step3.** There is a user Xiaobai who submitted a data deletion operation in the version number 1 data block; **delete b data** under the root object; the pseudo-code is as follows:
```js
DocMiniApp.Record.setRecord([
    {
      type: 'remove',
      data: {
        path: ['root', 'b' ],
        value: 1
      }
    }
  ]);
```
**Step4. The** final data block obtained by Xiaoming and Xiaobai is: ` data = {root: {a: 1, c: 1}};`