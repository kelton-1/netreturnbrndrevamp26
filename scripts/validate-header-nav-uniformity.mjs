import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const stripShopifyJsonComment = (source) => source.replace(/^\/\*[\s\S]*?\*\/\s*/, '');

const desktopMenu = read('snippets/desktop-menu.liquid');
const mobileMenu = read('snippets/mobile-menu.liquid');
const brandCss = read('assets/brand-revamp.css.liquid');
const headerGroup = JSON.parse(stripShopifyJsonComment(read('sections/header-group.json')));

const checks = [];

function check(name, predicate) {
  checks.push({ name, predicate });
}

check('desktop brand mega menu has one shared section structure', () =>
  desktopMenu.includes('mega-menu--brand__section-label') &&
  desktopMenu.includes('mega-menu--brand__nav-heading') &&
  desktopMenu.includes('default: mega_menu_block.settings.image_1') &&
  desktopMenu.includes('default: mega_menu_block.settings.image_2') &&
  brandCss.includes('.mega-menu--brand__section-label') &&
  brandCss.includes('.mega-menu--brand__nav-heading')
);

check('Shop, Learn, and Explore all opt into the brand mega-menu layout', () => {
  const blocks = Object.values(headerGroup.sections.header.blocks);

  return ['Shop', 'Learn', 'Explore'].every((menuItem) => {
    const block = blocks.find((candidate) => candidate.settings.menu_item === menuItem);
    return block && block.settings.enable_brand_layout === true;
  });
});

check('desktop Shop feature cards prioritize core buying paths over simulation-only suggestions', () => {
  const shopBlock = Object.values(headerGroup.sections.header.blocks)
    .find((candidate) => candidate.settings.menu_item === 'Shop');
  if (!shopBlock) return false;

  const settings = shopBlock.settings;
  const suggestedCopy = [
    settings.featured_product_title_override,
    settings.featured_product_body,
    settings.featured_product_cta_text,
    settings.featured_collection_title_override,
    settings.featured_collection_body,
    settings.featured_collection_cta_text,
  ].join(' ').toLowerCase();

  return suggestedCopy.includes('find your net') &&
    suggestedCopy.includes('shop packages') &&
    suggestedCopy.includes('shop nets') &&
    !suggestedCopy.includes('build a package') &&
    !suggestedCopy.includes('custom builder') &&
    !suggestedCopy.includes('simulator bay 10') &&
    !suggestedCopy.includes('launch monitor');
});

check('desktop Shop mega menu uses the same compact scale as Explore and Learn', () =>
  desktopMenu.includes('mega-menu--brand--shop') &&
  desktopMenu.includes('Shop by category') &&
  desktopMenu.includes('Start with the right path.') &&
  desktopMenu.includes('{%- unless is_shop_menu -%}') &&
  brandCss.includes('.mega-menu--brand--shop .mega-menu--brand__grid') &&
  brandCss.includes('.mega-menu--brand--shop .mega-menu--brand__nav-col')
);

check('mobile drawer uses a single premium primary grid instead of stacked quick links plus full Shop menu', () =>
  mobileMenu.includes('mobile-nav__primary-grid') &&
  mobileMenu.includes('mobile-nav__support-links') &&
  !mobileMenu.includes('mobile-nav__secondary') &&
  !mobileMenu.includes('mobile-nav__quick-links') &&
  !mobileMenu.includes('show_mobile_mega_images')
);

check('mobile primary paths match the desktop Shop north star categories', () =>
  [
    'Shop Nets',
    'Shop Packages',
    'Shop Sim Bays',
    'Shop Accessories',
    'Find Your Net',
    'Compare Nets',
    'Best Sellers',
    'Talk To An Expert',
  ].every((label) => mobileMenu.includes(label))
);

check('mobile copy is product-led and the drawer edge glow is suppressed', () =>
  mobileMenu.includes('Find the right net faster.') &&
  mobileMenu.includes('Golf and multi-sport nets built for daily reps.') &&
  mobileMenu.includes('Ready-made bundles for faster setup.') &&
  mobileMenu.includes('Bays, screens, turf, and room-ready setups.') &&
  brandCss.includes('#mobile-menu-drawer.drawer {') &&
  brandCss.includes('box-shadow: none') &&
  brandCss.includes('#mobile-menu-drawer .drawer__footer') &&
  brandCss.includes('.mobile-nav__support-links')
);

check('mobile and desktop nav typography is explicitly normalized', () =>
  brandCss.includes('.mobile-nav__primary-card-title') &&
  brandCss.includes('.mobile-nav__support-link') &&
  brandCss.includes('.mega-menu--brand__card-title') &&
  brandCss.includes('letter-spacing: 0;')
);

const failures = checks.filter(({ predicate }) => !predicate());

if (failures.length > 0) {
  console.error('Header nav uniformity validation failed:');
  for (const failure of failures) {
    console.error(`- ${failure.name}`);
  }
  process.exit(1);
}

console.log(`PASS: ${checks.length} header nav uniformity checks passed`);
