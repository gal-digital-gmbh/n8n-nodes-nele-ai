import { env } from '../../../config/env';
import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import type { ExecuteFunction } from '../types/execute-function';

export const resourceOption: INodePropertyOptions = {
  name: 'Model',
  value: 'model',
  description: 'Retrieve available models',
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
    default: 'load',
    noDataExpression: true,
    options: [
      {
        name: 'List Models',
        value: 'load',
        description: 'Lists all available AI models',
        action: 'List AI models',
      },
    ],
  },
] as const satisfies INodeProperties[];

type ExecuteFunctionName = (typeof operations)[number]['options'][number]['value'];

export const execute: Record<ExecuteFunctionName, ExecuteFunction> = {
  load: async (root) => {
    const response = (await root.helpers.httpRequestWithAuthentication.call(
      root,
      env.credentials.apiKey,
      {
        method: 'GET',
        url: `${env.baseUrl}/models`,
        json: true,
      },
    ));

    return [{
      json: response,
    }];
  },
};

export default {
  execute,
  resourceOption,
  operations,
};
