import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');

const checks = [];

function check(name, predicate) {
  checks.push({ name, predicate });
}

const productForm = read('snippets/product-form.liquid');
const productFormCro = read('snippets/product-form-cro.liquid');
const productFormAzalea = read('snippets/product-form-azalea.liquid');
const productInfo = read('snippets/product-info.liquid');
const themeJs = read('assets/theme.js');
const customJs = read('assets/custom.js');
const brandBestSellers = read('sections/brand-best-sellers.liquid');
const brandMiniBuilder = read('sections/brand-mini-builder.liquid');

for (const [name, source] of [
  ['default product form', productForm],
  ['CRO product form', productFormCro],
  ['Azalea product form', productFormAzalea],
]) {
  check(`${name} submits selected_or_first_available_variant id`, () =>
    source.includes('name="id" value="{{ product.selected_or_first_available_variant.id }}"')
  );

  check(`${name} disables Add to Cart for unavailable selected variants`, () =>
    source.includes('{% unless product.selected_or_first_available_variant.available %}disabled{% endunless %}') ||
    source.includes('{% unless product.selected_or_first_available_variant.available %}disabled="disabled"{% endunless %}')
  );

  check(`${name} no-JS variant select disables unavailable variants`, () =>
    source.includes('{% unless variant.available %}disabled="disabled"{% endunless %}')
  );
}

check('payment terms form follows the selected variant id', () =>
  productInfo.includes('<product-payment-terms form-id="{{ product_form_id }}">') &&
  productInfo.includes('name="id" value="{{ product.selected_or_first_available_variant.id }}"')
);

check('variant changes update add-to-cart availability before submit', () =>
  themeJs.includes('var PaymentContainer = class') &&
  themeJs.includes('_updateAddToCartButton(variant)') &&
  themeJs.includes('addToCartButtonElement.setAttribute("disabled", "disabled")') &&
  themeJs.includes('window.themeVariables.strings.productFormSoldOut')
);

check('product form posts FormData to the Shopify cart add endpoint', () =>
  themeJs.includes('const productForm = new FormData(this)') &&
  themeJs.includes('window.themeVariables.routes.cartAddUrl') &&
  themeJs.includes('productForm.delete("option1")') &&
  themeJs.includes('productForm.delete("option2")') &&
  themeJs.includes('productForm.delete("option3")')
);

check('optional upgrade path is guarded when the upgrade block is absent', () =>
  themeJs.includes('typeof upgradePropertyLabel !== "undefined"') &&
  themeJs.includes('variant.properties && variant.properties[upgradePropertyLabel]')
);

check('optional upgrade listener is isolated from normal add-to-cart errors', () =>
  customJs.includes('document.addEventListener("variant:added"') &&
  customJs.includes('try {') &&
  customJs.includes('fetch(window.Shopify.routes.root + \'cart/add.js\'')
);

check('brand best sellers quick add only uses an available product variant', () =>
  brandBestSellers.includes('assign featured_variant = product.selected_or_first_available_variant') &&
  brandBestSellers.includes('data-variant-id="{{ featured_variant.id }}"') &&
  brandBestSellers.includes('{% unless product.available %}disabled{% endunless %}')
);

check('brand mini builder bundle add skips empty variant ids', () =>
  brandMiniBuilder.includes('data-bb-variant-id') &&
  brandMiniBuilder.includes('return vid ? { id: parseInt(vid, 10), quantity: 1 } : null;') &&
  brandMiniBuilder.includes('.filter(Boolean)')
);

const failures = checks.filter(({ predicate }) => !predicate());

if (failures.length > 0) {
  console.error('Cart variant path validation failed:');
  for (const failure of failures) {
    console.error(`- ${failure.name}`);
  }
  process.exit(1);
}

console.log(`PASS: ${checks.length} cart variant path checks passed`);
