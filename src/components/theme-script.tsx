"use client";

import { useServerInsertedHTML } from "next/navigation";

const themeScript = `(function(){try{var p=document.documentElement.getAttribute('data-theme-pref')||'system';var d=p==='dark'||(p==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export function ThemeScript() {
  useServerInsertedHTML(() => (
    <script
      id="theme-script"
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  ));

  return null;
}
