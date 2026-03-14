const fs = require('fs');
const path = require('path');
const frontendDir = path.join('C:', 'Users', 'PC', 'OneDrive', 'Desktop', 'kidfit dz', 'frontend');
const dashboardFile = path.join(frontendDir, 'src', 'pages', 'Dashboard.jsx');
const publicDemoDir = path.join(frontendDir, 'public', 'clothes_demo');

let content = fs.readFileSync(dashboardFile, 'utf8');

const files = fs.readdirSync(publicDemoDir).filter(f => f.match(/\.(jpg|jpeg|png|gif|webp|jfif)$/i));

let itemsCode = 'const DEMO_CLOTHING = [\n';
for (const file of files) {
    const imageUrl = '/clothes_demo/' + file;
    const nameLower = file.toLowerCase();
    
    let itemCategory = 'tops';
    if (nameLower.includes('pant') || nameLower.includes('short') || nameLower.includes('trouser')) itemCategory = 'pants';
    if (nameLower.includes('jacket') || nameLower.includes('coat') || nameLower.includes('hoodie')) itemCategory = 'jackets';
    if (nameLower.includes('shoe') || nameLower.includes('sneaker') || nameLower.includes('boot')) itemCategory = 'shoes';
    
    const price = Math.floor(Math.random() * 40) + 10 + 0.99;
    const itemName = file.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').replace(/\s+/g, ' ').trim();
    
    itemsCode += `    {
        name: '${itemName.replace(/'/g, "\\'")}',
        image_url: '${imageUrl}',
        affiliate_link: '',
        price: ${price}, category: '${itemCategory}',
    },\n`;
}
itemsCode += ']';

const updatedContent = content.replace(/const DEMO_CLOTHING = \[\s*\{[\s\S]*?\]/, itemsCode);
fs.writeFileSync(dashboardFile, updatedContent, 'utf8');
console.log('Updated Dashboard.jsx with ' + files.length + ' items');
