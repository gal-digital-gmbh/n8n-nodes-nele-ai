import { env } from '../../../config/env';
import { imageGenerationFields } from './fields';
import { imageGenerationLoadOptions } from './load-options';
import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import type { ExecuteFunction } from '../types/execute-function';
import type { LoadOptions } from '../types/load-options';

export const resourceOption: INodePropertyOptions = {
  name: 'Image',
  value: 'image',
  description: 'Generate and retrieve images based on text prompts',
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
    default: 'generate',
    noDataExpression: true,
    options: [
      {
        name: 'Generate',
        value: 'generate',
        description: 'Creates an image from a text prompt',
        action: 'Generate an image',
      },
    ],
  },
] as const satisfies INodeProperties[];

export const fields: INodeProperties[] = [...imageGenerationFields];

export const loadOptions: LoadOptions = {
  ...imageGenerationLoadOptions,
};

type ExecuteFunctionName = (typeof operations)[number]['options'][number]['value'];

export const execute: Record<ExecuteFunctionName, ExecuteFunction> = {
  generate: async (root, itemIndex) => {
    const model = root.getNodeParameter('model', itemIndex);
    const prompt = root.getNodeParameter('prompt', itemIndex);

    let quality = undefined;
    let size = undefined;
    let style = undefined;
    let background = undefined;

    try {
      quality = root.getNodeParameter('quality', itemIndex);
      size = root.getNodeParameter('size', itemIndex);
      style = root.getNodeParameter('style', itemIndex);
      background = root.getNodeParameter('background', itemIndex);
    } catch {
      // Parameters not set, ignore
    }

    const response = (await root.helpers.httpRequestWithAuthentication.call(
      root,
      env.credentials.apiKey,
      {
        method: 'POST',
        url: `${env.baseUrl}/image`,
        body: {
          model,
          prompt,
          modelConfiguration: {
            quality,
            size,
            style,
            background,
          },
        },
        json: true,
      },
    ));

    let binary = undefined;

    if (typeof response.url === 'string') {
      const imageResponse = await root.helpers.httpRequestWithAuthentication.call(
        root,
        env.credentials.apiKey,
        {
          method: 'GET',
          url: response.url,
          encoding: 'arraybuffer',
        },
      );

      binary = {
        image: await root.helpers.prepareBinaryData(
          Buffer.from(imageResponse),
          'image.png',
          'image/png',
        ),
      };
    }

    return [{
      json: response,
      binary,
    }];
  },
};

export default {
  execute,
  resourceOption,
  operations,
  fields,
  loadOptions,
};
