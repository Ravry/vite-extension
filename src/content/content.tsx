import { createRoot, type Root } from "react-dom/client";
import Overlay from "./widgets/Overlay.tsx";

let shadow_root: ShadowRoot;

function inject_react_into_shadow() {
    const container = document.createElement('div');
    container.id = 'vite-extension-root';
    document.body.appendChild(container);

    shadow_root = container.attachShadow({ mode: 'closed' });

    const react_container = document.createElement('div');
    shadow_root.appendChild(react_container);

    const react_root: Root = createRoot(react_container);
    react_root.render(<Overlay/>);
}

inject_react_into_shadow();
