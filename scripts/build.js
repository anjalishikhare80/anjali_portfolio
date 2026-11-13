const fs   = require('fs');
const path = require('path');

const ROOT_DIR      = path.join(__dirname, '..');
const PUBLIC_DIR    = path.join(ROOT_DIR, 'public');
const COMPONENTS_DIR = path.join(PUBLIC_DIR, 'components');
const TEMPLATE_PATH  = path.join(PUBLIC_DIR, 'index.template.html');
const OUTPUT_PATH    = path.join(PUBLIC_DIR, 'index.html');

function build() {
  console.log('🔨 Building portfolio index.html from components...');

  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`❌ Template not found at: ${TEMPLATE_PATH}`);
    process.exit(1);
  }

  let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  const includePattern = /<!--\s*@include:\s*([a-zA-Z0-9_-]+)\s*-->/g;

  const result = template.replace(includePattern, (match, componentName) => {
    const compFile = path.join(COMPONENTS_DIR, `${componentName}.html`);
    if (!fs.existsSync(compFile)) {
      console.warn(`⚠️  Warning: Component file not found: ${compFile}`);
      return match;
    }
    const content = fs.readFileSync(compFile, 'utf8').trim();
    return `\n  <!-- ===================================================================\n       COMPONENT: ${componentName.toUpperCase()} (components/${componentName}.html)\n  =================================================================== -->\n  ${content}\n`;
  });

  fs.writeFileSync(OUTPUT_PATH, result, 'utf8');
  console.log(`✅ Successfully generated ${OUTPUT_PATH} (${Buffer.byteLength(result, 'utf8')} bytes)`);
}

if (require.main === module) {
  build();
}

module.exports = build;
