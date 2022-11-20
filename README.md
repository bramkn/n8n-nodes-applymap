# n8n-nodes-_node-name_

This is an n8n community node. It lets you easily map data. For example an Id to a string value.
Normally this would be done by using a merge or function/code node. This community node makes it a lot simpler.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

You can map data and also provide a default value for when there was no value found in the mapping table.
The first input is the data going through your n8n workflow. 
The second input is the mapping table.
This table consists of a 3 fields:
* mapName
* input
* output

The mapName is used in the parameters of the mapping, this makes it so you can have multiple mappings done in one go.
For this it is important that every map has its unique name.

The input is the input value so for example an Id, to be mapped.

The output is the output value that has to replace the input value when it is found.





## Compatibility

This node was developed and tested with n8n version 0.195.5


## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [n8n ApplyMap](https://github.com/bramkn/n8n-nodes-applymap.git)

## Version history

Only 1 version
