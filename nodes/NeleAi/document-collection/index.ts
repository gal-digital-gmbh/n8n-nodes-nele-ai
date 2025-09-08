import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import { documentCollectionSearchFields } from './fields';

export const resourceOption: INodePropertyOptions = {
  name: 'Knowledge Database',
  value: 'documentCollection',
  description: 'Manage and search your knowledge databases (aka document collections)',
};

export const operations: INodeProperties[] = [
  {
    displayName: 'Operation',
    displayOptions: {
      show: {
        resource: [resourceOption.value],
      },
    },
    name: 'operation',
    type: 'options',
    default: 'search',
    noDataExpression: true,
    options: [
      {
        name: 'Search',
        value: 'search',
        description: 'Returns relevant results for a given search query',
        action: 'Search knowledge database',
        routing: {
          request: {
            method: 'POST',
            url: '=/document-collections/{{$parameter.documentCollectionId}}/search',
          },
        },
      },
    ],
  },
];

export const fields: INodeProperties[] = [...documentCollectionSearchFields];

export default {
  resourceOption,
  operations,
  fields,
};
