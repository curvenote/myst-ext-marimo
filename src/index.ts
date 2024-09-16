import type { MystPlugin } from 'myst-common';
import { marimoDirective } from './marimoDirective.js';

const plugin: MystPlugin = {
  name: 'Marimo example',
  directives: [marimoDirective],
  roles: [],
  transforms: [],
};

export default plugin;
