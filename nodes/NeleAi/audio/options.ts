type Options = Record<string, { name: string; value: string }[]>;

// TODO: Load all options via API once available
export const modelOptions: Options[string] = [
  {
    name: 'Azure: Whisper',
    value: 'azure-whisper',
  },
];
