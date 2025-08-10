'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  // eslint-disable-next-line no-var
  var __apiNotice: { shownFor: Set<string>; lastBasePath: string } | undefined;
}

const ApiStatusModal = () => {
  const pathname = usePathname();
  const basePath = useMemo(() => pathname || '/', [pathname]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.__apiNotice) {
      window.__apiNotice = { shownFor: new Set<string>(), lastBasePath: basePath };
    }

    // If base path changed, reset the once-per-entry tracking so a fresh visit shows the modal again
    if (window.__apiNotice.lastBasePath !== basePath) {
      window.__apiNotice.shownFor = new Set<string>();
      window.__apiNotice.lastBasePath = basePath;
    }

    if (!window.__apiNotice.shownFor.has(basePath)) {
      setIsOpen(true);
      window.__apiNotice.shownFor.add(basePath);
    }
  }, [basePath]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
      <div className="relative mx-4 w-full max-w-lg rounded-lg bg-white p-6 text-gray-900 shadow-xl dark:bg-gray-900 dark:text-gray-100">
        <h2 className="text-lg font-semibold mb-2">Heads up — Card data may be slow right now</h2>
        <p className="text-sm leading-relaxed mb-4">
          The Pokémon TCG service seems to be experiencing elevated response times and occasional timeouts.
          Your results may take longer than usual to load, and some requests could fail intermittently. If that
          happens, a quick retry typically resolves it.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            onClick={() => setIsOpen(false)}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiStatusModal;


