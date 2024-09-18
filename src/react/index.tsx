import type { GenericNode } from 'myst-common';
import type { NodeRenderers } from '@myst-theme/providers';
import { useEffect } from 'react';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace React.JSX {
    interface IntrinsicElements {
      'marimo-island': {
        'data-app-id': string;
        'data-cell-id': string;
        'data-reactive': string;
        children: React.ReactNode;
      };
      'marimo-cell-output': Record<string, never>;
      'marimo-cell-code': { hidden: boolean; children: React.ReactNode };
    }
  }
}

export function MarimoRenderer({ node }: { node: GenericNode }) {
  return (
    <marimo-island data-app-id="main" data-cell-id="Hbol" data-reactive="true">
      <marimo-cell-output />
      <marimo-cell-code hidden>{encodeURIComponent(node.value || '')}</marimo-cell-code>
    </marimo-island>
  );
}

export function MarimoHeadRenderer({ node }: { node: GenericNode<{ version?: string }> }) {
  const version = node.version || 'latest';

  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.type = 'module';
    script.src = `https://cdn.jsdelivr.net/npm/@marimo-team/islands@${version}/dist/main.js`;

    // Create the link element
    const link = document.createElement('link');
    link.href = `https://cdn.jsdelivr.net/npm/@marimo-team/islands@${version}/dist/style.css`;
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
  }, [version]);

  return null;
}

const RENDERERS: NodeRenderers = {
  marimo: MarimoRenderer,
  marimoHead: MarimoHeadRenderer,
};

export default RENDERERS;
