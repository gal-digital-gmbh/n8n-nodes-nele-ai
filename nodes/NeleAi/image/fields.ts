import { routeToParameter } from '../support/route-to-parameter';
import { backgroundDisplayOptions, styleDisplayOptions } from './options';
import type { IDisplayOptions, INodeProperties } from 'n8n-workflow';

const displayOptions = {
  show: {
    resource: ['image'],
    operation: ['generate'],
  },
} as const satisfies IDisplayOptions;

export const imageGenerationFields: INodeProperties[] = [
  {
    displayName: 'Model Name or ID',
    displayOptions,
    name: 'model',
    type: 'options',
    required: true,
    default: '',
    description:
      'AI model that should generate the picture. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    routing: routeToParameter('model'),
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
                  property: 'image_generators',
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
                  name: '={{$responseItem.provider}}: {{$responseItem.title}}',
                  value: '={{$responseItem.id}}',
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    displayName: 'Prompt',
    displayOptions,
    name: 'prompt',
    type: 'string',
    default: '',
    required: true,
    routing: routeToParameter('prompt'),
    typeOptions: {
      rows: 4,
    },
  },
  {
    displayName: 'Quality Name or ID',
    displayOptions,
    name: 'quality',
    type: 'options',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    default: '',
    routing: routeToParameter('modelConfiguration.quality'),
    typeOptions: {
      loadOptionsDependsOn: ['model'],
      loadOptionsMethod: 'imageGenerationLoadQualityOptions',
    },
  },
  {
    displayName: 'Size Name or ID',
    displayOptions,
    name: 'size',
    type: 'options',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    default: '',
    routing: routeToParameter('modelConfiguration.size'),
    typeOptions: {
      loadOptionsDependsOn: ['model'],
      loadOptionsMethod: 'imageGenerationLoadSizeOptions',
    },
  },
  {
    displayName: 'Style Name or ID',
    displayOptions: {
      ...styleDisplayOptions,
      show: {
        ...displayOptions.show,
        ...styleDisplayOptions.show,
      },
    },
    name: 'style',
    type: 'options',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    default: '',
    routing: routeToParameter('modelConfiguration.style'),
    typeOptions: {
      loadOptionsDependsOn: ['model'],
      loadOptionsMethod: 'imageGenerationLoadStyleOptions',
    },
  },
  {
    displayName: 'Background Name or ID',
    displayOptions: {
      ...backgroundDisplayOptions,
      show: {
        ...displayOptions.show,
        ...backgroundDisplayOptions.show,
      },
    },
    name: 'background',
    type: 'options',
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    default: '',
    routing: routeToParameter('modelConfiguration.background'),
    typeOptions: {
      loadOptionsDependsOn: ['model'],
      loadOptionsMethod: 'imageGenerationLoadBackgroundOptions',
    },
  },
];
