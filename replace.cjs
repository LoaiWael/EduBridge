const fs = require('fs');

const files = [
  'c:/Loai/GitHub Clones/EduBridge/src/pages/RegisterPage.tsx',
  'c:/Loai/GitHub Clones/EduBridge/src/pages/ResetPassPage.tsx',
  'c:/Loai/GitHub Clones/EduBridge/src/pages/VerificationPage.tsx',
  'c:/Loai/GitHub Clones/EduBridge/src/pages/ForgetPassPage.tsx',
  'c:/Loai/GitHub Clones/EduBridge/src/pages/RoleSelectionPage.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/text-\[\#444444\]/g, 'text-brand-text-secondary');
    c = c.replace(/text-\[\#999999\]/g, 'text-brand-text-secondary/50');
    c = c.replace(/text-\[\#666666\]/g, 'text-brand-text-secondary');
    c = c.replace(/text-\[\#000000\]/g, 'text-brand-text-primary');
    c = c.replace(/text-\[\#333333\]/g, 'text-brand-text-secondary');
    c = c.replace(/text-\[\#888888\]/g, 'text-brand-dark-grey');
    c = c.replace(/text-\[\#555555\]/g, 'text-brand-text-primary');
    c = c.replace(/text-\[\#A0A0A0\]/g, 'text-brand-dark-grey');
    c = c.replace(/text-\[\#B0B0B0\]/g, 'text-brand-text-secondary/50');
    c = c.replace(/bg-\[\#F3F6FB\]\/80/g, 'bg-brand-card/80');
    c = c.replace(/bg-\[\#EAF0FA\]/g, 'bg-brand-background');
    c = c.replace(/bg-\[\#F5F5F5\]/g, 'bg-brand-card');
    c = c.replace(/bg-\[\#94A9CD\]/g, 'bg-brand-primary');
    c = c.replace(/text-black/g, 'text-brand-text-primary');
    c = c.replace(/bg-\[\#8598B8\]/g, 'bg-brand-primary/80');
    c = c.replace(/ring-\[\#94A9CD\]\/40/g, 'ring-brand-primary/40');
    c = c.replace(/border-\[\#000000\]/g, 'border-brand-text-primary');
    c = c.replace(/data-\[state=checked\]:bg-\[\#000000\]/g, 'data-[state=checked]:bg-brand-secondary');
    fs.writeFileSync(f, c, 'utf8');
  }
});
console.log('done replacing');
