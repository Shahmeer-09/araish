import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockProducts = [
  {
    name: 'Royal Diamond Solitaire Ring',
    category: 'rings',
    description: 'Exquisite solitaire ring featuring a brilliant-cut diamond set in 18K white gold. A timeless piece that embodies elegance and sophistication.',
    price: 2500,
    material: '18K White Gold, Diamond',
    inStock: true,
    featured: true,
  },
  {
    name: 'Emerald Teardrop Necklace',
    category: 'necklaces',
    description: 'Stunning emerald teardrop necklace surrounded by micro-pavé diamonds. Perfect for special occasions and black-tie events.',
    price: 3200,
    material: '18K Yellow Gold, Emerald, Diamonds',
    inStock: true,
    featured: true,
  },
  {
    name: 'Pearl Drop Earrings',
    category: 'earrings',
    description: 'Classic pearl drop earrings with diamond accents. These elegant earrings add a touch of grace to any ensemble.',
    price: 1800,
    material: 'Platinum, Pearls, Diamonds',
    inStock: true,
    featured: true,
  },
  {
    name: 'Sapphire Halo Ring',
    category: 'rings',
    description: 'Captivating sapphire halo ring with intricate diamond detailing. A statement piece for the discerning collector.',
    price: 2800,
    material: '18K White Gold, Sapphire, Diamonds',
    inStock: true,
    featured: false,
  },
  {
    name: 'Rose Gold Tennis Bracelet',
    category: 'bracelets',
    description: 'Luxurious tennis bracelet in rose gold with perfectly matched diamonds. A versatile piece for day or evening wear.',
    price: 4500,
    material: '18K Rose Gold, Diamonds',
    inStock: true,
    featured: true,
  },
  {
    name: 'Vintage Chandelier Earrings',
    category: 'earrings',
    description: 'Vintage-inspired chandelier earrings with cascading diamonds and gemstones. Make a grand entrance with these show-stopping pieces.',
    price: 3500,
    material: '18K Yellow Gold, Mixed Gemstones',
    inStock: true,
    featured: false,
  },
  {
    name: 'Diamond Infinity Pendant',
    category: 'necklaces',
    description: 'Elegant infinity symbol pendant adorned with brilliant diamonds. A meaningful gift symbolizing eternal love.',
    price: 1500,
    material: '18K White Gold, Diamonds',
    inStock: true,
    featured: false,
  },
  {
    name: 'Royal Bridal Set',
    category: 'sets',
    description: 'Complete bridal jewellery set featuring necklace, earrings, and ring. Crafted with exceptional attention to detail for your special day.',
    price: 8500,
    material: 'Platinum, Diamonds, Pearls',
    inStock: true,
    featured: true,
  },
  {
    name: 'Gold Filigree Bangle',
    category: 'bracelets',
    description: 'Intricately designed gold filigree bangle with traditional motifs. A perfect blend of heritage and elegance.',
    price: 2200,
    material: '22K Yellow Gold',
    inStock: true,
    featured: false,
  },
  {
    name: 'Ruby Heart Pendant',
    category: 'necklaces',
    description: 'Heart-shaped ruby pendant with diamond border. Express your love with this romantic piece.',
    price: 1900,
    material: '18K White Gold, Ruby, Diamonds',
    inStock: true,
    featured: false,
  },
  {
    name: 'Platinum Wedding Band',
    category: 'rings',
    description: 'Classic platinum wedding band with brushed finish. Timeless elegance for your commitment.',
    price: 1200,
    material: 'Platinum',
    inStock: true,
    featured: false,
  },
  {
    name: 'Turquoise Statement Ring',
    category: 'rings',
    description: 'Bold turquoise ring set in sterling silver. A unique piece that adds color to any outfit.',
    price: 850,
    material: 'Sterling Silver, Turquoise',
    inStock: true,
    featured: false,
  },
  {
    name: 'Diamond Cluster Earrings',
    category: 'earrings',
    description: 'Sparkling diamond cluster earrings in white gold. Perfect for everyday luxury.',
    price: 2100,
    material: '18K White Gold, Diamonds',
    inStock: true,
    featured: false,
  },
  {
    name: 'Gold Link Chain Necklace',
    category: 'necklaces',
    description: 'Sophisticated gold link chain with a modern design. Versatile enough to layer or wear alone.',
    price: 1600,
    material: '14K Yellow Gold',
    inStock: true,
    featured: false,
  },
  {
    name: 'Amethyst Drop Earrings',
    category: 'earrings',
    description: 'Elegant amethyst drop earrings with gold accents. Add a pop of color to your collection.',
    price: 980,
    material: '18K Yellow Gold, Amethyst',
    inStock: true,
    featured: false,
  },
  {
    name: 'Diamond Eternity Band',
    category: 'rings',
    description: 'Stunning eternity band with diamonds all around. Symbol of endless love and devotion.',
    price: 3400,
    material: '18K White Gold, Diamonds',
    inStock: true,
    featured: false,
  },
  {
    name: 'Pearl Strand Necklace',
    category: 'necklaces',
    description: 'Classic pearl strand necklace with gold clasp. Timeless elegance for any occasion.',
    price: 2800,
    material: 'Cultured Pearls, 14K Gold Clasp',
    inStock: true,
    featured: false,
  },
  {
    name: 'Citrine Cocktail Ring',
    category: 'rings',
    description: 'Bold citrine cocktail ring in yellow gold. Make a statement with this vibrant piece.',
    price: 1450,
    material: '18K Yellow Gold, Citrine',
    inStock: true,
    featured: false,
  },
  {
    name: 'Multi-Strand Bracelet',
    category: 'bracelets',
    description: 'Delicate multi-strand bracelet with mixed metals. Modern and chic design.',
    price: 780,
    material: 'Sterling Silver, Rose Gold Plating',
    inStock: true,
    featured: false,
  },
  {
    name: 'Opal Pendant Necklace',
    category: 'necklaces',
    description: 'Mesmerizing opal pendant with fire and color. A truly unique natural gemstone.',
    price: 1750,
    material: '18K White Gold, Opal, Diamonds',
    inStock: true,
    featured: false,
  },
  {
    name: 'Gold Hoop Earrings',
    category: 'earrings',
    description: 'Classic gold hoop earrings in various sizes. A must-have staple for every jewelry box.',
    price: 650,
    material: '14K Yellow Gold',
    inStock: true,
    featured: false,
  },
  {
    name: 'Aquamarine Ring',
    category: 'rings',
    description: 'Serene aquamarine ring with white gold band. Cool blue tones for a calming effect.',
    price: 1680,
    material: '18K White Gold, Aquamarine',
    inStock: true,
    featured: false,
  },
  {
    name: 'Charm Bracelet',
    category: 'bracelets',
    description: 'Customizable charm bracelet with various pendant options. Tell your story with charms.',
    price: 920,
    material: 'Sterling Silver',
    inStock: true,
    featured: false,
  },
  {
    name: 'Garnet Stud Earrings',
    category: 'earrings',
    description: 'Deep red garnet stud earrings in gold settings. Rich color for a touch of luxury.',
    price: 720,
    material: '14K Yellow Gold, Garnet',
    inStock: true,
    featured: false,
  },
  {
    name: 'Vintage Locket Necklace',
    category: 'necklaces',
    description: 'Engraved vintage-style locket with space for photos. Keep loved ones close to your heart.',
    price: 890,
    material: '14K Yellow Gold',
    inStock: true,
    featured: false,
  },
];

async function main() {
  console.log('Starting to seed products...');

  for (const product of mockProducts) {
    await prisma.product.create({
      data: product,
    });
    console.log(`Created product: ${product.name}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
