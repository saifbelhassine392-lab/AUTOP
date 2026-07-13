const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'app/pieces/page.tsx',
  'app/devis/page.tsx',
  'app/panier/page.tsx',
  'app/connexion/page.tsx',
  'app/inscription/page.tsx',
  'app/mes-devis/page.tsx'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the main top-level solid backgrounds with transparent glassmorphism
    // For pieces, devis, etc.
    content = content.replace(/bg-\[#0a0e1a\] min-h-screen/g, 'bg-slate-950/60 backdrop-blur-md min-h-screen');
    content = content.replace(/bg-slate-900 flex items-center/g, 'bg-slate-950/60 backdrop-blur-md flex items-center');
    content = content.replace(/bg-slate-900 text-white flex items-center/g, 'bg-slate-950/60 backdrop-blur-md text-white flex items-center');
    content = content.replace(/bg-\[#0a0e1a\] px-4/g, 'bg-slate-950/60 backdrop-blur-md px-4');
    
    // Some internal cards have bg-slate-900. We can make them slightly more transparent
    content = content.replace(/className="bg-slate-900 /g, 'className="bg-slate-900/60 backdrop-blur-sm ');
    content = content.replace(/className="([^"]*)bg-slate-900([^"]*)"/g, (match, p1, p2) => {
      if (!p1.includes('hover:') && !p2.includes('hover:')) {
        return `className="${p1}bg-slate-900/60 backdrop-blur-sm${p2}"`;
      }
      return match;
    });

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
