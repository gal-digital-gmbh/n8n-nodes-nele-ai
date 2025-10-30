import { env } from '../../../config/env';
import { documentCollectionSearchFields } from './fields';
import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import type { ExecuteFunction } from '../types/execute-function';

export const resourceOption: INodePropertyOptions = {
  name: 'Knowledge Database',
  value: 'documentCollection',
  description: 'Manage and search your knowledge databases (aka document collections)',
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
    default: 'search',
    noDataExpression: true,
    options: [
      {
        name: 'Search',
        value: 'search',
        description: 'Returns relevant results for a given search query',
        action: 'Search knowledge database',
      },
    ],
  },
] as const satisfies INodeProperties[];

export const fields: INodeProperties[] = [...documentCollectionSearchFields];

type ExecuteFunctionName = (typeof operations)[number]['options'][number]['value'];

export const execute: Record<ExecuteFunctionName, ExecuteFunction> = {
  search: async (root, itemIndex) => {
    const documentCollectionId = root.getNodeParameter('documentCollectionId', itemIndex);
    const query = root.getNodeParameter('query', itemIndex);
    const resultCount = root.getNodeParameter('resultCount', itemIndex);
    const maxDistance = root.getNodeParameter('maxDistance', itemIndex);

    const response = (await root.helpers.httpRequestWithAuthentication.call(
      root,
      env.credentials.apiKey,
      {
        method: 'POST',
        url: `${env.baseUrl}/document-collections/${documentCollectionId}/search`,
        body: {
          query,
          limit: resultCount,
          max_distance: maxDistance,
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
  execute,
  resourceOption,
  operations,
  fields,
};
