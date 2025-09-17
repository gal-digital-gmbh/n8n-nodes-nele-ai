import { NodeOperationError } from 'n8n-workflow';
import { audioTranscriptionFields } from './fields';
import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';

export const resourceOption: INodePropertyOptions = {
  name: 'Audio',
  value: 'audio',
  description: 'Transcribe and retrieve audio files as text',
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
    default: 'transcribe',
    noDataExpression: true,
    options: [
      {
        name: 'Transcribe',
        value: 'transcribe',
        description: 'Creates a text transcription from an audio file',
        action: 'Transcribe an audio file',
        routing: {
          request: {
            method: 'POST',
            url: '=/transcription',
          },
          send: {
            preSend: [
              async function addBinaryFileInput(this, requestOptions) {
                const options = requestOptions.body as {
                  model: string;
                  language?: string;
                };

                const input = this.getInputData().binary;

                if (!input) {
                  throw new NodeOperationError(this.getNode(), 'Invalid input', {
                    level: 'info',
                    description:
                      'The input has to contain the audio file to transcribe as binary data',
                  });
                }

                const file = Buffer.from(input.data.data, 'base64');

                const boundary = `----WebKitFormBoundary${Math.random().toString(16)}`;
                const endBoundary = `\r\n--${boundary}--\r\n`;

                let textPart = `--${boundary}\r\nContent-Disposition: form-data; name="model"\r\n\r\n${options.model}\r\n`;

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

                requestOptions.body = payload;
                requestOptions.headers = {
                  ...requestOptions.headers,
                  'Content-Type': `multipart/form-data; boundary=${boundary}`,
                  'Content-Length': payload.length,
                };

                return requestOptions;
              },
            ],
          },
        },
      },
    ],
  },
];

export const fields: INodeProperties[] = [...audioTranscriptionFields];

export default {
  resourceOption,
  operations,
  fields,
};
