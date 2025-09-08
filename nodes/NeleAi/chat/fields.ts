import { routeToParameter } from '../support/route-to-parameter';
import type { IDisplayOptions, INodeProperties } from 'n8n-workflow';

const displayOptions = {
  show: {
    resource: ['chat'],
    operation: ['completionSync'],
  },
} as const satisfies IDisplayOptions;

export const chatCompletionFields: INodeProperties[] = [
  {
    displayName: 'Model Name or ID',
    displayOptions,
    name: 'model',
    type: 'options',
    required: true,
    default: '',
    description:
      'AI model that should generate the text response. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    routing: routeToParameter('model'),
    typeOptions: {
      loadOptionsMethod: 'chatCompletionLoadModels',
    },
  },
  {
    displayName: 'Messages',
    displayOptions,
    name: 'messages',
    type: 'fixedCollection',
    required: true,
    default: [],
    typeOptions: {
      multipleValues: true,
      minRequiredFields: 1,
    },
    placeholder: 'Add Message',
    options: [
      {
        displayName: 'Message',
        name: 'message',
        required: true,
        values: [
          {
            displayName: 'Role',
            name: 'role',
            type: 'options',
            default: 'user',
            required: true,
            options: [
              { name: 'User', value: 'user' },
              { name: 'Assistant', value: 'assistant' },
              { name: 'System', value: 'system' },
            ],
          },
          {
            displayName: 'Content',
            name: 'content',
            type: 'string',
            default: '',
            required: true,
            typeOptions: { rows: 4 },
          },
        ],
      },
    ],
  },
  {
    displayName: 'Messages',
    displayOptions,
    name: 'mappedMessages',
    type: 'hidden',
    default: [],
    required: true,
    routing: {
      send: {
        property: 'messages',
        value: '={{$parameter.messages.message}}',
        type: 'body',
      },
    },
  },
  {
    displayName: 'Options',
    displayOptions,
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    options: [
      {
        displayName: 'Knowledge Database Name or ID',
        name: 'documentCollectionId',
        type: 'options',
        default: '',
        description:
          'If set, will retrieve data with context of the last given user message. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
        routing: routeToParameter('documentCollectionId'),
        typeOptions: {
          loadOptionsMethod: 'chatCompletionLoadCollections',
          loadOptionsDependsOn: ['model'],
        },
      },
      {
        displayName: 'Max Tokens',
        name: 'max_tokens',
        type: 'number',
        default: 200,
        description: 'Maximum tokens in the generated reply',
        routing: routeToParameter('max_tokens'),
        typeOptions: { minValue: 1 },
      },
      {
        displayName: 'Temperature',
        name: 'temperature',
        type: 'number',
        default: 0,
        description:
          'What sampling temperature to use. Higher values will make the output more random, while lower values will make it more deterministic.',
        routing: routeToParameter('temperature'),
        typeOptions: { minValue: 0, maxValue: 1, numberStep: 0.01 },
      },
    ],
  },
];
