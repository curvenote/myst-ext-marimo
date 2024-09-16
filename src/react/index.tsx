import { type GenericNode } from 'myst-common';
import { type NodeRenderers } from '@myst-theme/providers';
import { useEffect } from 'react';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace React.JSX {
    interface IntrinsicElements {
      ['marimo-island']: {
        'data-app-id': string;
        'data-cell-id': string;
        'data-reactive': string;
        children: any;
      };
      ['marimo-cell-output']: Record<string, never>;
      ['marimo-cell-code']: { hidden: boolean; children: any };
    }
  }
}

export function MarimoRenderer({ node }: { node: GenericNode }) {
  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.jsdelivr.net/npm/@marimo-team/islands@0.6.2/dist/main.js';

    // Create the link element
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/@marimo-team/islands@0.6.2/dist/style.css';
    link.rel = 'stylesheet';
    link.crossOrigin = 'anonymous';

    // Append elements to the head
    document.head.appendChild(script);
    document.head.appendChild(link);

    // Cleanup function to remove the elements when the component unmounts
    return () => {
      document.head.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);
  return (
    <marimo-island data-app-id="main" data-cell-id="Hbol" data-reactive="true">
      <marimo-cell-output />
      <marimo-cell-code hidden>{encodeURIComponent(node.value || '')}</marimo-cell-code>
    </marimo-island>
  );
}

const RENDERERS: NodeRenderers = {
  marimo: MarimoRenderer,
};

export default RENDERERS;
