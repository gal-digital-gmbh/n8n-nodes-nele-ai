import type { IDisplayOptions } from 'n8n-workflow';

type Options = Record<string, { name: string; value: string }[]>;

// TODO: Load all options via API once available
export const qualityOptions: Options = {
  'azure-dall-e-3': [
    { name: 'Standard', value: 'standard' },
    { name: 'HD', value: 'hd' },
  ],
  'dall-e-3': [
    { name: 'Standard', value: 'standard' },
    { name: 'HD', value: 'hd' },
  ],
  'gpt-image-1': [
    { name: 'Auto', value: 'auto' },
    { name: 'Low', value: 'low' },
    { name: 'Medium', value: 'medium' },
    { name: 'High', value: 'high' },
  ],
};

export const sizeOptions: Options = {
  'azure-dall-e-3': [
    { name: '1024x1024', value: '1024x1024' },
    { name: '1792x1024', value: '1792x1024' },
    { name: '1024x1792', value: '1024x1792' },
  ],
  'dall-e-3': [
    { name: '1024x1024', value: '1024x1024' },
    { name: '1792x1024', value: '1792x1024' },
    { name: '1024x1792', value: '1024x1792' },
  ],
  'gpt-image-1': [
    { name: 'Auto', value: 'auto' },
    { name: '1024x1024', value: '1024x1024' },
    { name: '1536x1024', value: '1536x1024' },
    { name: '1024x1536', value: '1024x1536' },
  ],
};

export const styleOptions: Options = {
  'azure-dall-e-3': [
    { name: 'Vivid', value: 'vivid' },
    { name: 'Natural', value: 'natural' },
  ],
  'dall-e-3': [
    { name: 'Vivid', value: 'vivid' },
    { name: 'Natural', value: 'natural' },
  ],
};

export const styleDisplayOptions: IDisplayOptions = {
  show: {
    model: ['azure-dall-e-3', 'dall-e-3'],
  },
};

export const backgroundOptions: Options = {
  'gpt-image-1': [
    { name: 'Auto', value: '' },
    { name: 'Transparent', value: 'transparent' },
    { name: 'Opaque', value: 'opaque' },
  ],
};

export const backgroundDisplayOptions: IDisplayOptions = {
  show: {
    model: ['gpt-image-1'],
  },
};
