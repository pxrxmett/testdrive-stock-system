const fs = require('fs');
const path = require('path');

console.log('🔧 Starting defu fix...');

const mjsPath = path.join(__dirname, 'node_modules/defu/dist/defu.mjs');
console.log('📁 Checking file:', mjsPath);

if (fs.existsSync(mjsPath)) {
  console.log('✅ File exists, reading content...');
  let content = fs.readFileSync(mjsPath, 'utf8');
  
  console.log('📄 Current export line:');
  console.log(content.split('\n').filter(line => line.includes('export')));
  
  if (!content.includes('defuFn')) {
    console.log('🔄 Adding defuFn export...');
    
    const newContent = content.replace(
      'export { defu as default };',
      'const defuFn = defu.fn;\nexport { defu as default, defuFn };'
    );
    
    fs.writeFileSync(mjsPath, newContent);
    console.log('✅ Fixed defu.mjs');
    
    // ตรวจสอบผลลัพธ์
    const updatedContent = fs.readFileSync(mjsPath, 'utf8');
    console.log('📄 New export lines:');
    console.log(updatedContent.split('\n').filter(line => line.includes('export') || line.includes('defuFn')));
  } else {
    console.log('ℹ️ defuFn already exists');
  }
} else {
  console.log('❌ File not found!');
}
