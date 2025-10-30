import { env } from '../../../config/env';
import { LoadOptions } from '../types/load-options';
import { chatCompletionFields } from './fields';
import { chatCompletionLoadOptions } from './load-options';
import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import type { ExecuteFunction } from '../types/execute-function';

export const resourceOption: INodePropertyOptions = {
  name: 'Chat',
  value: 'chat',
  description: 'Generate text responses via a conversational model',
};

export const operations = [
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
      },
    ],
  },
] as const satisfies INodeProperties[];

export const fields: INodeProperties[] = [...chatCompletionFields];

export const loadOptions: LoadOptions = {
  ...chatCompletionLoadOptions,
};

type ExecuteFunctionName = (typeof operations)[number]['options'][number]['value'];

export const execute: Record<ExecuteFunctionName, ExecuteFunction> = {
  completionSync: async (root, itemIndex) => {
    const model = root.getNodeParameter('model', itemIndex);
    const messages = root.getNodeParameter('messages', itemIndex) as { message: unknown };
    const additionalFields = root.getNodeParameter('additionalFields', itemIndex);

    const response = (await root.helpers.httpRequestWithAuthentication.call(
      root,
      env.credentials.apiKey,
      {
        method: 'POST',
        url: `${env.baseUrl}/chat-completion-sync`,
        body: {
          model,
          messages: messages.message,
          documentCollectionId: additionalFields.documentCollectionId,
          max_tokens: additionalFields.max_tokens,
          temperature: additionalFields.temperature,
        },
        json: true,
      },
    ));

    return [{
      json: response,
    }];
  },
};

export default {
  resourceOption,
  operations,
  fields,
  loadOptions,
  execute,
};
