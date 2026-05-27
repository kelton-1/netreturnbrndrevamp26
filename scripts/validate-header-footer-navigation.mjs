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
const brandCss = read('assets/brand-revamp.css.liquid');
const themeJs = read('assets/theme.js');
const headerGroup = JSON.parse(stripShopifyJsonComment(read('sections/header-group.json')));
const footerGroup = JSON.parse(stripShopifyJsonComment(read('sections/footer-group.json')));
const brandDocs = read('docs/brand-revamp-2026.md');

check('mobile drawer is Shopify Navigation-driven instead of hardcoded cards', () =>
  !mobileMenu.includes('mobile-nav__link-row') &&
  !mobileMenu.includes('mobile-nav__toggle') &&
  !mobileMenu.includes('collapsible-content id="mobile-menu-') &&
  !mobileMenu.includes('mobile-nav__primary-grid') &&
  !mobileMenu.includes('mobile-nav__decision-links') &&
  mobileMenu.includes('{%- for link in menu.links -%}') &&
  mobileMenu.includes('mobile-nav__menu-list') &&
  mobileMenu.includes('mobile-nav__menu-link') &&
  mobileMenu.includes('mobile-nav__submenu')
);

check('mobile utility links remain in the full-screen drawer footer', () =>
  mobileMenu.includes('mobile-nav__utility-link') &&
  mobileMenu.includes('Order Status') &&
  mobileMenu.includes('Product Support') &&
  mobileMenu.includes('header.general.account')
);

check('header mobile controls follow approved order and menu placement', () =>
  header.includes('header__icon-wrapper--mobile-account') &&
  header.includes('header__icon-wrapper--mobile-menu') &&
  header.indexOf('header__icon-wrapper--mobile-account') < header.indexOf('routes.cart_url') &&
  header.indexOf('routes.cart_url') < header.indexOf('header__icon-wrapper--mobile-menu')
);

check('header uses homepage transparent mode and dedicated sidebar navigation setting', () =>
  headerGroup.sections.header.settings.enable_transparent_header === true &&
  headerGroup.sections.header.settings.sidebar_navigation_menu !== ''
);

check('brand CSS implements island header and full-screen dark mobile drawer', () =>
  brandCss.includes('Mobile header island + full-screen menu') &&
  brandCss.includes('.header.header--transparent .header__wrapper') &&
  brandCss.includes('#mobile-menu-drawer.drawer') &&
  brandCss.includes('width: 100vw') &&
  brandCss.includes('mobile-nav__menu-link') &&
  brandCss.includes('mobile-nav__drawer-logo')
);

check('desktop mega menu has guided decision-support label', () =>
  desktopMenu.includes('mega-menu__guided-title') &&
  desktopMenu.includes('Not sure where to start?')
);

check('desktop mega menu hover has a short grace period before closing', () =>
  themeJs.includes('let closingTimeout = null') &&
  themeJs.includes('parentElement.contains(event.relatedTarget)') &&
  themeJs.includes('dropdown.addEventListener("mouseenter", cancelClose)') &&
  themeJs.includes('}, 240);')
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

check('mobile replaces inherited nested accordions with full-screen menu rows', () =>
  !mobileMenu.includes("unless link_title_downcase == 'shop'") &&
  !mobileMenu.includes('mobile-nav__secondary') &&
  mobileMenu.includes('mobile-nav__menu') &&
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
