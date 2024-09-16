import type { DirectiveSpec } from 'myst-common';

export const marimoDirective: DirectiveSpec = {
  name: 'marimo',
  doc: 'A renderer for marimo',
  options: {
    name: { type: String, doc: 'URL of the logo' },
    label: { type: String, doc: 'The label of the marimo component', alias: ['name'] },
    caption: { type: 'myst', doc: 'The caption of the marimo component' },
    version: { type: String, doc: 'The version string of marimo renderer' },
  },
  body: {
    type: String,
    doc: 'The body of the marimo comonent',
  },
  run(data, vfile, ctx) {
    const marimo = {
      type: 'marimo',
      data: { ...data.options },
      value: data.body as string,
    };
    return [marimo];
  },
};
