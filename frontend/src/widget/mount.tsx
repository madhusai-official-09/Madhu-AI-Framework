import React from "react";
import { createRoot } from "react-dom/client";
import MadhuAIWidget from "./MadhuAIWidget";
import widgetCss from "./widget.css?inline";

export interface MountOptions {
  projectId: string;
  backendUrl: string;
}

function injectStyles() {
  if (document.querySelector('style[data-madhu-ai-widget="true"]')) {
    return;
  }

  const style = document.createElement("style");

  style.setAttribute("data-madhu-ai-widget", "true");
  style.textContent = widgetCss;

  document.head.appendChild(style);
}

export function mountMadhuAIWidget(
  element: HTMLElement,
  options: MountOptions,
) {
  injectStyles();

  const root = createRoot(element);

  root.render(
    <React.StrictMode>
      <MadhuAIWidget
        projectId={options.projectId}
        backendUrl={options.backendUrl}
      />
    </React.StrictMode>,
  );

  return () => root.unmount();
}

const script = document.currentScript as HTMLScriptElement | null;

if (script) {
  const projectId = script.dataset.projectId;
  const backendUrl = script.dataset.backendUrl;

  if (projectId && backendUrl) {
    const mount = () => {
      const element = document.createElement("div");

      element.id = "madhu-ai-widget-root";
      document.body.appendChild(element);

      mountMadhuAIWidget(element, {
        projectId,
        backendUrl,
      });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mount, { once: true });
    } else {
      mount();
    }
  }
}
