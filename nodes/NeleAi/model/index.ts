import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';

export const resourceOption: INodePropertyOptions = {
  name: 'Model',
  value: 'model',
  description: 'Retrieve available models',
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
    default: 'load',
    noDataExpression: true,
    options: [
      {
        name: 'List Models',
        value: 'load',
        description: 'Lists all available AI models',
        action: 'List AI models',
        routing: {
          request: {
            method: 'GET',
            url: '=/models',
          },
        },
      },
    ],
  },
];

export default {
  resourceOption,
  operations,
};
