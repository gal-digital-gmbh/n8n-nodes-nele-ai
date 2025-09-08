import { env } from '../../config/env';
import audio from './audio';
import chat from './chat';
import documentCollection from './document-collection';
import image from './image';
import model from './model';
import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class NeleAi implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'nele.ai',
    name: 'neleAi',
    group: ['transform'],
    version: 1,
    subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
    description: 'Search for results in your nele.ai knowledge database',
    defaults: {
      name: 'nele.ai',
    },
    inputs: ['main'],
    outputs: ['main'],

    icon: {
      dark: 'file:logo-dark.svg',
      light: 'file:logo-light.svg',
    },

    credentials: [
      {
        name: env.credentials.apiKey,
        required: true,
      },
    ],

    requestDefaults: {
      baseURL: env.baseUrl,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },

    codex: {
      categories: ['Miscellaneous'],
      resources: {
        credentialDocumentation: [
          {
            url: env.docs.url,
          },
        ],
        primaryDocumentation: [
          {
            url: env.docs.url,
          },
        ],
      },
    },

    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        default: '',
        noDataExpression: true,
        options: [
          chat.resourceOption,
          documentCollection.resourceOption,
          image.resourceOption,
          audio.resourceOption,
          model.resourceOption,
        ],
      },

      ...chat.operations,
      ...chat.fields,
      ...documentCollection.operations,
      ...documentCollection.fields,
      ...image.operations,
      ...image.fields,
      ...audio.operations,
      ...audio.fields,
      ...model.operations,
    ],
  };

  methods = {
    loadOptions: {
      ...chat.loadOptions,
      ...image.loadOptions,
    },
  };
}
