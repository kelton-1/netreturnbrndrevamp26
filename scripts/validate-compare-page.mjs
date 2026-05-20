import fs from 'node:fs';

const templatePath = 'templates/page.compare.json';
const sectionPath = 'sections/mobile-compare-nets.liquid';

const errors = [];

if (!fs.existsSync(sectionPath)) {
  errors.push(`Missing ${sectionPath}`);
}

let template;
try {
  template = JSON.parse(fs.readFileSync(templatePath, 'utf8').replace(/\/\*[\s\S]*?\*\//, ''));
} catch (error) {
  errors.push(`Unable to parse ${templatePath}: ${error.message}`);
}

if (template) {
  const sectionEntries = Object.entries(template.sections || {});
  const compareEntry = sectionEntries.find(([, section]) => section.type === 'mobile-compare-nets');

  if (!compareEntry) {
    errors.push(`${templatePath} does not include a mobile-compare-nets section`);
  } else {
    const [sectionId, section] = compareEntry;
    const blockCount = Object.keys(section.blocks || {}).length;

    if (blockCount !== 8) {
      errors.push(`Expected 8 compare model blocks, found ${blockCount}`);
    }

    if (!template.order.includes(sectionId)) {
      errors.push(`${sectionId} is not listed in template order`);
    }
  }
}

if (fs.existsSync(sectionPath)) {
  const section = fs.readFileSync(sectionPath, 'utf8');

  [
    'compare-assist',
    'compare-fit-entry',
    'data-fit-pill-list',
    'data-result-summary',
    'data-result-group="best"',
    'data-result-group="other"',
    'data-width',
    'data-height',
    'data-price',
    'data-use-case',
    'data-fit-reset',
    '{% schema %}',
    '{% javascript %}',
  ].forEach((needle) => {
    if (!section.includes(needle)) {
      errors.push(`${sectionPath} is missing "${needle}"`);
    }
  });
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Compare page validation passed');
