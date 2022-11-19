import { IExecuteFunctions } from 'n8n-core';
import { IDataObject, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';

import { get, map, pick , set, unset} from 'lodash';
import _ from 'lodash';

interface MappingTable {
	field: string;
	mapName: string;
	defaultValue:string;
	renameBool:boolean;
	renameValue:string;
}

export class ApplyMap implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ApplyMap',
		name: 'applyMap',
		icon: 'fa:edit',
		group: ['transform'],
		version: 1,
		description: 'ApplyMap',
		defaults: {
			name: 'ApplyMap',
			color: '#733bde',
		},
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: ['main','main'],
		inputNames: ['Data','Mapping Table'],
		outputs: ['main'],//Whether only the values set on this node should be kept and all others removed
		properties: [
			{
				displayName: 'Mappings',
				name: 'mappings',
				placeholder: 'Add new field value Mapping',
				description: 'Adds a field which should be Mapped',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
					sortable: true,
				},
				default: {},
				options: [
					{
						displayName: 'Field',
						name: 'field',
						values: [
							{
								displayName: 'Field to Map',
								name: 'field',
								type: 'string',
								default: '',
								placeholder: 'Field Name',
								description: 'The name of the field to map, you can use dot notation if needed for example: "level1.level2.genderId"',
							},
							{
								displayName: 'Mapping',
								name: 'mapName',
								type: 'string',
								default: '',
								placeholder: 'Mapping Name',
								description: 'The name of the Mapping to apply, this mapping must exist in the incomming mapping table',
							},
							{
								displayName: 'Default Value',
								name: 'defaultValue',
								type: 'string',
								default: '',
								placeholder: 'Default Value',
								description: 'If the value cannot be found, set this default value, for example: "unknown Gender"',
							},
							{
								displayName: 'Rename Field',
								name: 'renameBool',
								type: 'boolean',
								default: false,
								description: 'Whether to also rename the field after the mapping',
							},
							{
								displayName: 'Rename Field To',
								name: 'renameValue',
								type: 'string',
								default: '',
								description: 'Renamed field name',
								displayOptions: {
									show: {
										renameBool: [true],
									},
								},
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items:INodeExecutionData[] = this.getInputData(0);
		let mappingTable:INodeExecutionData[] = this.getInputData(1);

		const returnData: INodeExecutionData[] = [];

		let item: INodeExecutionData;
		let newItem: INodeExecutionData;
		let fieldsToMap: MappingTable[];

		fieldsToMap = this.getNodeParameter('mappings.field', 0, []) as MappingTable[];
		const mappingTables = _.mapValues(_.groupBy(mappingTable.map((x)=>(x.json)), 'mapName'),clist => clist.map(mappingTable => _.omit(mappingTable, 'mapName')));

		if(mappingTables){
			console.log(mappingTables);

			for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {

				item = items[itemIndex];
				console.log(item);
				for(const map of fieldsToMap){
					if(item.json[`${map.field}`]){
						if(mappingTables[`${map.mapName}`]){
							item.json[`${map.field}`] = mappingTables[`${map.mapName}`].find(x => '' + x.input === '' + item.json[`${map.field}`])?.output || map.defaultValue;
						}
						if(map.renameBool && item.json[`${map.renameValue}`] !== ''){
							item.json[`${map.renameValue}`] = item.json[`${map.field}`];
							delete item.json[`${map.field}`];
						}
					}
				}
				console.log(item);
				// Copy the whole JSON data as data on any level can be renamed
				newItem = {
					json: JSON.parse(JSON.stringify(item.json)),
					pairedItem: {
						item: itemIndex,
					},
				};

				if (item.binary !== undefined) {
					// Reference binary data if any exists. We can reference it
					// as this nodes does not change it
					newItem.binary = item.binary;
				}
				returnData.push(newItem);

			}
			return [returnData];
		}
		return [items];
	}
}
