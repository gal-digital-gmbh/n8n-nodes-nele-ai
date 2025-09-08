import FormData from 'form-data';
import { NodeOperationError } from 'n8n-workflow';
import z from 'zod';
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
                const options = z
                  .object({
                    model: z.string(),
                    language: z.string().optional(),
                  })
                  .safeParse(requestOptions.body);

                if (!options.success) {
                  throw new NodeOperationError(this.getNode(), 'Invalid options', {
                    level: 'info',
                    description: 'The options parameter is not valid',
                  });
                }

                const input = z
                  .object({
                    binary: z.object({
                      data: z.object({
                        data: z.string(),
                        fileName: z.string(),
                        mimeType: z.string(),
                      }),
                    }),
                  })
                  .safeParse(this.getInputData());

                if (!input.success) {
                  throw new NodeOperationError(this.getNode(), 'Invalid input', {
                    level: 'info',
                    description:
                      'The input has to contain the audio file to transcribe as binary data',
                  });
                }

                const file = Buffer.from(input.data.binary.data.data, 'base64');

                const form = new FormData();

                form.append('file', file, {
                  filename: input.data.binary.data.fileName,
                  contentType: input.data.binary.data.mimeType,
                });

                form.append('model', options.data.model);

                if (options.data.language) {
                  form.append('language', options.data.language);
                }

                requestOptions.body = form;
                requestOptions.headers = {
                  ...requestOptions.headers,
                  ...form.getHeaders(),
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
