import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');

const stripShopifyJsonComment = (source) => source.replace(/^\/\*[\s\S]*?\*\/\s*/, '');

const checks = [];

function check(name, predicate) {
  checks.push({ name, predicate });
}

const mobileMenu = read('snippets/mobile-menu.liquid');
const desktopMenu = read('snippets/desktop-menu.liquid');
const header = read('sections/header.liquid');
const headerGroup = JSON.parse(stripShopifyJsonComment(read('sections/header-group.json')));
const footerGroup = JSON.parse(stripShopifyJsonComment(read('sections/footer-group.json')));
const brandDocs = read('docs/brand-revamp-2026.md');

check('mobile drawer has no inherited accordion rows below the primary cards', () =>
  !mobileMenu.includes('mobile-nav__link-row') &&
  !mobileMenu.includes('mobile-nav__toggle') &&
  !mobileMenu.includes('collapsible-content id="mobile-menu-') &&
  mobileMenu.includes('mobile-nav__support-links')
);

check('mobile drawer exposes conversion-first primary paths', () =>
  [
    'Shop Nets',
    'Shop Packages',
    'Shop Sim Bays',
    'Shop Accessories',
    'Find Your Net',
    'Compare Nets',
    'Best Sellers',
    'Talk To An Expert',
  ].every((label) => mobileMenu.includes(label)) &&
    mobileMenu.includes('mobile-nav__primary-grid') &&
    mobileMenu.includes('mobile-nav__decision-links') &&
    mobileMenu.includes('mobile-nav__support-links') &&
    !mobileMenu.includes('mobile-nav__quick-links')
);

check('mobile primary shopping paths render before support links', () => {
  const primaryIndex = mobileMenu.indexOf('mobile-nav__primary-grid');
  const supportIndex = mobileMenu.indexOf('mobile-nav__support-links');
  return primaryIndex !== -1 && supportIndex !== -1 && primaryIndex < supportIndex;
});

check('desktop mega menu has guided decision-support label', () =>
  desktopMenu.includes('mega-menu__guided-title') &&
  desktopMenu.includes('Not sure where to start?')
);

check('desktop Explore and Learn use brand mega menus with distinct imagery', () => {
  const blocks = headerGroup.sections.header.blocks;
  const blockList = Object.values(blocks);
  const shopImages = new Set(
    blockList
      .filter((block) => block.settings.menu_item === 'Shop')
      .flatMap((block) => [block.settings.featured_product_image, block.settings.featured_collection_image, block.settings.image_1, block.settings.image_2])
      .filter(Boolean)
  );

  return ['Explore', 'Learn'].every((menuItem) => {
    const block = blockList.find((candidate) => candidate.settings.menu_item === menuItem);
    if (!block) return false;
    const settings = block.settings;
    const images = [settings.featured_product_image, settings.featured_collection_image].filter(Boolean);
    return settings.enable_brand_layout === true &&
      images.length === 2 &&
      images.every((image) => !shopImages.has(image));
  });
});

check('mobile replaces inherited nested menus with direct support links', () =>
  !mobileMenu.includes("unless link_title_downcase == 'shop'") &&
  !mobileMenu.includes('mobile-nav__secondary') &&
  mobileMenu.includes('mobile-nav__support-links') &&
  !mobileMenu.includes('show_mobile_mega_images') &&
  !mobileMenu.includes('mobile-nav__guided')
);

check('stale BFCM header highlighting is removed', () =>
  !/(bfcm-menu-highlight|bf-sale-link|Black Friday|BFCM)/i.test(header)
);

check('footer newsletter copy promises buying help instead of generic deals', () => {
  const newsletter = footerGroup.sections.footer.blocks.newsletter.settings.content.toLowerCase();
  return newsletter.includes('setup tips') &&
    newsletter.includes('buying guides') &&
    !newsletter.includes('latest news and exclusive deals');
});

check('footer trust strip and link hierarchy remain configured', () => {
  const trustStrip = footerGroup.sections['text-with-icons'];
  const blocks = footerGroup.sections.footer.blocks;
  const menus = Object.values(blocks)
    .filter((block) => block.type === 'links')
    .map((block) => block.settings.menu);
  return trustStrip.disabled !== true &&
    menus.includes('shop') &&
    menus.includes('explore') &&
    menus.includes('learn');
});

check('header footer handoff doc exists', () =>
  fs.existsSync('docs/header-footer-navigation-handoff.md')
);

check('brand revamp docs record header/footer navigation completion', () =>
  brandDocs.includes('Header/footer navigation completion')
);

const failures = checks.filter(({ predicate }) => !predicate());

if (failures.length > 0) {
  console.error('Header/footer navigation validation failed:');
  for (const failure of failures) {
    console.error(`- ${failure.name}`);
  }
  process.exit(1);
}

console.log(`PASS: ${checks.length} header/footer navigation checks passed`);
