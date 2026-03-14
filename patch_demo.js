const fs = require('fs');
const pathFile = 'c:/Users/PC/OneDrive/Desktop/kidfit dz/frontend/src/pages/Dashboard.jsx';

let content = fs.readFileSync(pathFile, 'utf8');

const newDemo = `const DEMO_CLOTHING = [
    {
        name: 'Amazon Top 1',
        image_url: 'https://m.media-amazon.com/images/I/71-tQVWYjWL.jpg',
        affiliate_link: 'https://www.amazon.com/dp/B0F3V2PZLB?tag=dhgds88-20',
        price: 19.99, category: 'tops',
    },
    {
        name: 'Amazon Top 2',
        image_url: 'https://m.media-amazon.com/images/I/71ZIIDgg41L.jpg',
        affiliate_link: 'https://www.amazon.com/dp/B0FMDTQ4B3?tag=dhgds88-20',
        price: 24.99, category: 'tops',
    },
    {
        name: 'SWISSWELL Boys Long Sleeve Button-up Shirt',
        image_url: 'https://m.media-amazon.com/images/I/41V+EYwgRdL._AC_SR100,100_QL65_.jpg',
        affiliate_link: 'https://www.amazon.com/dp/B0F5PYCK2F?tag=dhgds88-20',
        price: 29.99, category: 'tops',
    },
    {
        name: 'Kids Fashion 1',
        image_url: 'https://images.unsplash.com/photo-1652501089372-98938d79006e?w=500&q=80',
        affiliate_link: '',
        price: 15.99, category: 'tops',
    },
    {
        name: 'Kids Fashion 2',
        image_url: 'https://i.pinimg.com/1200x/2b/fb/a6/2bfba6cf9e2d0dc241714f4c532d5523.jpg',
        affiliate_link: '',
        price: 18.99, category: 'pants',
    },
    {
        name: 'Kids Fashion 3',
        image_url: 'https://i.pinimg.com/1200x/47/b6/16/47b616b40773ae1cb0431606cdecfc7b.jpg',
        affiliate_link: '',
        price: 22.99, category: 'tops',
    },
    {
        name: 'Kids Fashion 4',
        image_url: 'https://i.pinimg.com/1200x/e3/88/39/e38839fb6271b7be291a500563fcdb72.jpg',
        affiliate_link: '',
        price: 25.99, category: 'tops',
    },
    {
        name: 'Kids Fashion 5',
        image_url: 'https://i.pinimg.com/1200x/80/17/5a/80175ae917c9de324e8d53a53d9f4971.jpg',
        affiliate_link: '',
        price: 19.99, category: 'tops',
    },
    {
        name: 'Kids Fashion 6',
        image_url: 'https://i.pinimg.com/736x/87/23/0d/87230dddfef4c9a1e4c4cc37d6251e20.jpg',
        affiliate_link: '',
        price: 28.99, category: 'pants',
    },
    {
        name: 'Kids Fashion 7',
        image_url: 'https://i.pinimg.com/1200x/c1/96/eb/c196eb2cc1d3200860f059b4de9855af.jpg',
        affiliate_link: '',
        price: 14.99, category: 'tops',
    },
    {
        name: 'Kids Fashion 8',
        image_url: 'https://i.pinimg.com/1200x/15/07/9a/15079a245957fe4598ed389c1ef2185f.jpg',
        affiliate_link: '',
        price: 16.99, category: 'tops',
    },
    {
        name: 'Kids Fashion 9',
        image_url: 'https://i.pinimg.com/1200x/ea/1f/ac/ea1facc2d43fe8389f7118ca71bf1c4c.jpg',
        affiliate_link: '',
        price: 21.99, category: 'jackets',
    }
]`;

const result = content.replace(/const DEMO_CLOTHING\s*=\s*\[[\s\S]*?\]\r?\n/, newDemo + '\n');
if (result !== content) {
    fs.writeFileSync(pathFile, result);
    console.log('Demo data patched successfully!');
} else {
    console.log('Failed to patch, pattern mismatch!');
}
