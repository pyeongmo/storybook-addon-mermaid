// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const viteFinal = async (config: any) => {
  config.plugins = config.plugins || [];
  config.plugins.push({
    name: 'mermaid-loader',
    transform(code: string, id: string) {
      if (id.endsWith('.mmd')) {
        return {
          code: `export default ${JSON.stringify(code)};`,
          map: null,
        };
      }
    },
  });
  return config;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const webpack = async (config: any) => {
  config.module.rules.push({
    test: /\.mmd$/,
    type: 'asset/source',
  });
  return config;
};
