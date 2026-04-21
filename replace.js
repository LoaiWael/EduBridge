import fs from 'fs';

const files = [
  'c:/Loai/GitHub Clones/EduBridge/src/pages/RegisterPage.tsx',
  'c:/Loai/GitHub Clones/EduBridge/src/pages/ResetPassPage.tsx',
  'c:/Loai/GitHub Clones/EduBridge/src/pages/VerificationPage.tsx',
  'c:/Loai/GitHub Clones/EduBridge/src/pages/ForgetPassPage.tsx',
  'c:/Loai/GitHub Clones/EduBridge/src/pages/RoleSelectionPage.tsx',
  'c:/Loai/GitHub Clones/EduBridge/src/pages/ChatBotPage.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.split('text-[#444444]').join('text-brand-text-secondary');
    c = c.split('text-[#999999]').join('text-brand-text-secondary/50');
    c = c.split('text-[#666666]').join('text-brand-text-secondary');
    c = c.split('text-[#000000]').join('text-brand-text-primary');
    c = c.split('text-[#333333]').join('text-brand-text-secondary');
    c = c.split('text-[#888888]').join('text-brand-dark-grey');
    c = c.split('text-[#555555]').join('text-brand-text-primary');
    c = c.split('text-[#A0A0A0]').join('text-brand-dark-grey');
    c = c.split('text-[#B0B0B0]').join('text-brand-text-secondary/50');
    c = c.split('bg-[#F3F6FB]/80').join('bg-brand-card/80');
    c = c.split('bg-[#EAF0FA]').join('bg-brand-background');
    c = c.split('bg-[#94A9CD]').join('bg-brand-primary');
    // c = c.split('bg-white').join('bg-brand-card');
    c = c.split('text-black').join('text-brand-text-primary');
    c = c.split('bg-[#8598B8]').join('bg-brand-primary/80');
    c = c.split('ring-[#94A9CD]/40').join('ring-brand-primary/40');
    c = c.split('border-[#000000]').join('border-brand-text-primary');
    c = c.split('data-[state=checked]:bg-[#000000]').join('data-[state=checked]:bg-brand-secondary');
    c = c.split('bg-[#F5F5F5]').join('bg-brand-card');
    c = c.split('text-[#8FE0A4]').join('text-brand-green');
    c = c.split('text-[#868A9A]').join('text-brand-text-secondary');

    fs.writeFileSync(f, c, 'utf8');
  }
});
console.log('done replacing');
