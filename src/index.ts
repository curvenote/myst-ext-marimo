import type { MystPlugin } from 'myst-common';
import { marimoHeadDirective, marimoDirective } from './directives.js';

const plugin: MystPlugin = {
  name: 'marimo plugin',
  directives: [marimoHeadDirective, marimoDirective],
  roles: [],
  transforms: [],
};

export default plugin;
