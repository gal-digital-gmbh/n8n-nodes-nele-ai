import { env } from '../../../config/env';
import { imageGenerationFields } from './fields';
import { imageGenerationLoadOptions } from './load-options';
import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import type { LoadOptions } from '../types/load-options';

export const resourceOption: INodePropertyOptions = {
  name: 'Image',
  value: 'image',
  description: 'Generate and retrieve images based on text prompts',
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
    default: 'generate',
    noDataExpression: true,
    options: [
      {
        name: 'Generate',
        value: 'generate',
        description: 'Creates an image from a text prompt',
        action: 'Generate an image',
        routing: {
          request: {
            method: 'POST',
            url: '=/image',
          },
          output: {
            postReceive: [
              async function addImageResponse(this, items) {
                for (const item of items) {
                  if (typeof item.json.url !== 'string') {
                    continue;
                  }

                  const imageResponse = await this.helpers.httpRequestWithAuthentication.call(
                    this,
                    env.credentials.apiKey,
                    {
                      method: 'GET',
                      url: item.json.url,
                      encoding: 'arraybuffer',
                    },
                  );

                  item.binary = {
                    image: await this.helpers.prepareBinaryData(
                      Buffer.from(imageResponse),
                      'image.png',
                      'image/png',
                    ),
                  };
                }

                return items;
              },
            ],
          },
        },
      },
    ],
  },
];

export const fields: INodeProperties[] = [...imageGenerationFields];

export const loadOptions: LoadOptions = {
  ...imageGenerationLoadOptions,
};

export default {
  resourceOption,
  operations,
  fields,
  loadOptions,
};
