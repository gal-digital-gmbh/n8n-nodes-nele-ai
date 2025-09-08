import { LoadOptions } from '../types/load-options';
import { chatCompletionFields } from './fields';
import { chatCompletionLoadOptions } from './load-options';
import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';

export const resourceOption: INodePropertyOptions = {
  name: 'Chat',
  value: 'chat',
  description: 'Generate text responses via a conversational model',
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
    default: 'completionSync',
    noDataExpression: true,
    options: [
      {
        name: 'Completion',
        value: 'completionSync',
        description: 'Creates a response for a given chat message history',
        action: 'Generate a text response',
        routing: {
          request: {
            method: 'POST',
            url: '=/chat-completion-sync',
          },
        },
      },
    ],
  },
];

export const fields: INodeProperties[] = [...chatCompletionFields];

export const loadOptions: LoadOptions = {
  ...chatCompletionLoadOptions,
};

export default {
  resourceOption,
  operations,
  fields,
  loadOptions,
};
