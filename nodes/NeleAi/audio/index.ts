import { NodeOperationError } from 'n8n-workflow';
import { env } from '../../../config/env';
import { audioTranscriptionFields } from './fields';
import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import type { ExecuteFunction } from '../types/execute-function';

export const resourceOption: INodePropertyOptions = {
  name: 'Audio',
  value: 'audio',
  description: 'Transcribe and retrieve audio files as text',
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
    default: 'transcribe',
    noDataExpression: true,
    options: [
      {
        name: 'Transcribe',
        value: 'transcribe',
        description: 'Creates a text transcription from an audio file',
        action: 'Transcribe an audio file',
      },
    ],
  },
] as const satisfies INodeProperties[];

export const fields: INodeProperties[] = [...audioTranscriptionFields];

type ExecuteFunctionName = (typeof operations)[number]['options'][number]['value'];

export const execute: Record<ExecuteFunctionName, ExecuteFunction> = {
  transcribe: async (root, itemIndex) => {
    const model = root.getNodeParameter('model', itemIndex);
    const options = root.getNodeParameter('options', itemIndex);

    const input = root.getInputData()[itemIndex]?.binary;

    if (!input) {
      throw new NodeOperationError(root.getNode(), 'Invalid input', {
        level: 'info',
        description:
          'The input has to contain the audio file to transcribe as binary data',
      });
    }

    const file = Buffer.from(input.data.data, 'base64');

    const boundary = `----WebKitFormBoundary${Math.random().toString(16)}`;
    const endBoundary = `\r\n--${boundary}--\r\n`;

    let textPart = `--${boundary}\r\nContent-Disposition: form-data; name="model"\r\n\r\n${model}\r\n`;

    if (options.language) {
      textPart += `--${boundary}\r\nContent-Disposition: form-data; name="language"\r\n\r\n${options.language}\r\n`;
    }

    const binaryPart = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${input.data.fileName}"\r\nContent-Type: ${input.data.mimeType}\r\n\r\n`;

    const payload = Buffer.concat([
      Buffer.from(textPart, 'utf8'),
      Buffer.from(binaryPart, 'utf8'),
      file,
      Buffer.from(endBoundary, 'utf8'),
    ]);

    const response = (await root.helpers.httpRequestWithAuthentication.call(
      root,
      env.credentials.apiKey,
      {
        method: 'POST',
        url: `${env.baseUrl}/transcription`,
        body: payload,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': payload.length,
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
