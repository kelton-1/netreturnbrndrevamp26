import fs from 'node:fs';

const source = fs.readFileSync('templates/index.json', 'utf8');
const template = JSON.parse(source.replace(/^\/\*[\s\S]*?\*\/\s*/, ''));
const film = template.sections.brand_film_homepage;
const failures = [];

if (!film) {
  failures.push('homepage brand film section exists');
} else {
  if (film.type !== 'brand-film') {
    failures.push('homepage brand film keeps the brand-film section type');
  }

  if (film.settings?.enable_pin !== false) {
    failures.push('homepage brand film is not pinned, so no empty patterned scroll bands render under the video');
  }

  if (film.settings?.show_drift !== false) {
    failures.push('homepage brand film does not use animated gradient drift behind the video');
  }
}

const order = template.order || [];
if (!order.includes('brand_film_homepage')) {
  failures.push('homepage order still includes the video section');
}

if (failures.length > 0) {
  console.error('Homepage film validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('PASS: homepage brand film keeps the video without pinned pattern bands');
