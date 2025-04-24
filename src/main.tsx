
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Reset any global styles that might constrain width
const style = document.createElement('style');
style.innerHTML = `
  body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(<App />);
