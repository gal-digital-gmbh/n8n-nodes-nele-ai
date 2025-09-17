import { routeToParameter } from '../support/route-to-parameter';
import { modelOptions } from './options';
import type { IDisplayOptions, INodeProperties } from 'n8n-workflow';

const displayOptions = {
  show: {
    resource: ['audio'],
    operation: ['transcribe'],
  },
} as const satisfies IDisplayOptions;

export const audioTranscriptionFields: INodeProperties[] = [
  {
    displayName: 'Model Name or ID',
    displayOptions,
    name: 'model',
    type: 'options',
    required: true,
    default: '',
    description:
      'AI model that should transcribe the audio file. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    routing: routeToParameter('model'),
    options: modelOptions,
  },
  {
    displayName: 'Options',
    displayOptions,
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    options: [
      {
        displayName: 'Language',
        name: 'language',
        type: 'string',
        default: '',
        description:
          'The language of the input audio, in iso-639-1 format. Optional, but improves transcription accuracy.',
        routing: routeToParameter('language'),
      },
    ],
  },
];
