import type { IDisplayOptions, INodeProperties } from 'n8n-workflow';

const displayOptions = {
  show: {
    resource: ['documentCollection'],
    operation: ['search'],
  },
} as const satisfies IDisplayOptions;

export const documentCollectionSearchFields: INodeProperties[] = [
  {
    displayName: 'Knowledge Database',
    displayOptions,
    name: 'documentCollectionId',
    type: 'options',
    required: true,
    default: '',
    description:
      'The nele.ai knowledge database to query from. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    typeOptions: {
      loadOptions: {
        routing: {
          request: {
            method: 'GET',
            url: '/models',
            json: true,
          },
          output: {
            postReceive: [
              {
                type: 'rootProperty',
                properties: {
                  property: 'document_collections',
                },
              },
              {
                type: 'filter',
                properties: {
                  pass: '={{$responseItem.is_usable === true}}',
                },
              },
              {
                type: 'setKeyValue',
                properties: {
                  name: '={{$responseItem.title}}',
                  value: '={{$responseItem.id}}',
                },
              },
              {
                type: 'sort',
                properties: {
                  key: 'name',
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    displayName: 'Query',
    displayOptions,
    name: 'query',
    type: 'string',
    default: '',
  },
  {
    displayName: 'Result Count',
    displayOptions,
    name: 'resultCount',
    type: 'number',
    description: 'Max number of results to return',
    default: 10,
    typeOptions: {
      minValue: 1,
      maxValue: 20,
    },
  },
  {
    displayName: 'Max Distance',
    displayOptions,
    name: 'maxDistance',
    type: 'number',
    default: 0.5,
    typeOptions: {
      minValue: 0,
      maxValue: 1,
    },
  },
];
