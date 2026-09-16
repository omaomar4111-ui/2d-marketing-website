const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Helper to extract a section by id
function extractSection(id, text) {
  const startTag = `<section id="${id}"`;
  const startIdx = text.indexOf(startTag);
  if (startIdx === -1) {
    console.error(`Section not found: ${id}`);
    return null;
  }
  // Find matching closing </section>
  const endTag = '</section>';
  const endIdx = text.indexOf(endTag, startIdx);
  if (endIdx === -1) {
    console.error(`Closing tag not found for: ${id}`);
    return null;
  }
  const fullSection = text.substring(startIdx, endIdx + endTag.length);
  return { startIdx, endIdx: endIdx + endTag.length, content: fullSection };
}

// Extract sections
const clientsSec = extractSection('clients', html);
const teamSec = extractSection('team', html);
const diagnosisSec = extractSection('s-diagnosis', html);
const engineSec = extractSection('s-engine', html);
const proofSec = extractSection('s-proof', html);
const calcSec = extractSection('calc-section', html);
const packagesSec = extractSection('packages', html);
const faqSec = extractSection('faq', html);
const exitSec = extractSection('s-exit', html);

if (clientsSec && teamSec && diagnosisSec && engineSec && proofSec && calcSec && packagesSec && faqSec && exitSec) {
  // Find where sections start after #values
  const valuesSec = extractSection('values', html);
  const beforeSections = html.substring(0, valuesSec.endIdx);
  const afterSections = html.substring(html.indexOf('<footer'));

  // Reconstructed order:
  // 1. #clients (Brands Trust Us)
  // 2. #team (فريقنا)
  // 3. #s-engine (الأرقام والنظام)
  // 4. #s-diagnosis (المشكلة الحقيقية)
  // 5. #calc-section (احسب عائدك)
  // 6. #packages (الباقات)
  // 7. #faq (الأسئلة الشائعة)
  // 8. #s-proof (قصص النجاح / Testimonials)
  // 9. #s-exit (Contact CTA)

  const reorderedMiddle = [
    '',
    clientsSec.content,
    teamSec.content,
    engineSec.content,
    diagnosisSec.content,
    calcSec.content,
    packagesSec.content,
    faqSec.content,
    proofSec.content,
    exitSec.content,
    ''
  ].join('\n\n');

  html = beforeSections + '\n\n' + reorderedMiddle + '\n\n' + afterSections;
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('Sections reordered successfully in index.html according to VR Agency layout!');
} else {
  console.error('Failed to extract some sections for reordering');
  process.exit(1);
}
