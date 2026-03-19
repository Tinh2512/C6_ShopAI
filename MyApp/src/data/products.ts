export interface Product {
  id:          string;
  name:        string;
  price:       number;
  originalPrice?: number;
  category:    string;
  rating:      number;
  reviewCount: number;
  image:       string;
  inStock:     boolean;
  tags:        string[];
}

export interface Category {
  id:    string;
  name:  string;
  icon:  string;
}

export const CATEGORIES: Category[] = [
  { id: 'all',         name: 'All',         icon: '🛍️' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'clothing',    name: 'Clothing',    icon: '👕' },
  { id: 'shoes',       name: 'Shoes',       icon: '👟' },
  { id: 'books',       name: 'Books',       icon: '📚' },
  { id: 'home',        name: 'Home',        icon: '🏠' },
  { id: 'sports',      name: 'Sports',      icon: '⚽' },
];

const generateProducts = (): Product[] => {
  const data: Product[] = [
    // Electronics
    { id: '1',  name: 'iPhone 15 Pro',          price: 999,  originalPrice: 1099, category: 'electronics', rating: 4.8, reviewCount: 2341, image: 'https://picsum.photos/seed/iphone/300/300',    inStock: true,  tags: ['apple', 'smartphone', 'ios'] },
    { id: '2',  name: 'Samsung Galaxy S24',      price: 849,  originalPrice: 999,  category: 'electronics', rating: 4.6, reviewCount: 1823, image: 'https://picsum.photos/seed/samsung/300/300',   inStock: true,  tags: ['samsung', 'android'] },
    { id: '3',  name: 'MacBook Pro 14"',         price: 1999, originalPrice: 2199, category: 'electronics', rating: 4.9, reviewCount: 987,  image: 'https://picsum.photos/seed/macbook/300/300',   inStock: true,  tags: ['apple', 'laptop'] },
    { id: '4',  name: 'Sony WH-1000XM5',         price: 349,  originalPrice: 399,  category: 'electronics', rating: 4.7, reviewCount: 3102, image: 'https://picsum.photos/seed/sony/300/300',      inStock: true,  tags: ['headphones', 'wireless'] },
    { id: '5',  name: 'iPad Air M2',             price: 749,                       category: 'electronics', rating: 4.5, reviewCount: 654,  image: 'https://picsum.photos/seed/ipad/300/300',      inStock: false, tags: ['apple', 'tablet'] },
    { id: '6',  name: 'Dell XPS 15',             price: 1599, originalPrice: 1799, category: 'electronics', rating: 4.4, reviewCount: 421,  image: 'https://picsum.photos/seed/dell/300/300',      inStock: true,  tags: ['laptop', 'windows'] },
    { id: '7',  name: 'Apple Watch Series 9',    price: 399,  originalPrice: 429,  category: 'electronics', rating: 4.6, reviewCount: 1567, image: 'https://picsum.photos/seed/watch/300/300',     inStock: true,  tags: ['apple', 'smartwatch'] },
    { id: '8',  name: 'Google Pixel 8',          price: 699,                       category: 'electronics', rating: 4.3, reviewCount: 876,  image: 'https://picsum.photos/seed/pixel/300/300',     inStock: true,  tags: ['google', 'android'] },

    // Clothing
    { id: '9',  name: 'Classic White T-Shirt',   price: 29,   originalPrice: 39,   category: 'clothing',    rating: 4.2, reviewCount: 5432, image: 'https://picsum.photos/seed/tshirt/300/300',    inStock: true,  tags: ['basic', 'casual'] },
    { id: '10', name: 'Slim Fit Jeans',           price: 79,   originalPrice: 99,   category: 'clothing',    rating: 4.4, reviewCount: 2341, image: 'https://picsum.photos/seed/jeans/300/300',     inStock: true,  tags: ['denim', 'casual'] },
    { id: '11', name: 'Wool Blend Coat',          price: 199,  originalPrice: 249,  category: 'clothing',    rating: 4.7, reviewCount: 876,  image: 'https://picsum.photos/seed/coat/300/300',      inStock: true,  tags: ['winter', 'formal'] },
    { id: '12', name: 'Linen Summer Dress',       price: 89,                        category: 'clothing',    rating: 4.5, reviewCount: 1234, image: 'https://picsum.photos/seed/dress/300/300',     inStock: false, tags: ['summer', 'casual'] },
    { id: '13', name: 'Graphic Hoodie',           price: 59,   originalPrice: 79,   category: 'clothing',    rating: 4.3, reviewCount: 3210, image: 'https://picsum.photos/seed/hoodie/300/300',    inStock: true,  tags: ['casual', 'streetwear'] },
    { id: '14', name: 'Formal Blazer',            price: 149,  originalPrice: 199,  category: 'clothing',    rating: 4.6, reviewCount: 654,  image: 'https://picsum.photos/seed/blazer/300/300',    inStock: true,  tags: ['formal', 'office'] },

    // Shoes
    { id: '15', name: 'Nike Air Max 270',         price: 149,  originalPrice: 179,  category: 'shoes',       rating: 4.7, reviewCount: 4321, image: 'https://picsum.photos/seed/nike/300/300',      inStock: true,  tags: ['nike', 'sneakers'] },
    { id: '16', name: 'Adidas Ultraboost 23',     price: 179,  originalPrice: 199,  category: 'shoes',       rating: 4.6, reviewCount: 3456, image: 'https://picsum.photos/seed/adidas/300/300',    inStock: true,  tags: ['adidas', 'running'] },
    { id: '17', name: 'Classic Leather Loafers',  price: 129,                       category: 'shoes',       rating: 4.4, reviewCount: 987,  image: 'https://picsum.photos/seed/loafer/300/300',    inStock: true,  tags: ['formal', 'leather'] },
    { id: '18', name: 'Trail Running Shoes',      price: 119,  originalPrice: 139,  category: 'shoes',       rating: 4.5, reviewCount: 1543, image: 'https://picsum.photos/seed/trail/300/300',     inStock: false, tags: ['outdoor', 'running'] },

    // Books
    { id: '19', name: 'Atomic Habits',            price: 18,   originalPrice: 22,   category: 'books',       rating: 4.9, reviewCount: 12453, image: 'https://picsum.photos/seed/book1/300/300',   inStock: true,  tags: ['self-help', 'bestseller'] },
    { id: '20', name: 'The Psychology of Money',  price: 16,                        category: 'books',       rating: 4.8, reviewCount: 8765,  image: 'https://picsum.photos/seed/book2/300/300',   inStock: true,  tags: ['finance', 'bestseller'] },
    { id: '21', name: 'Deep Work',                price: 17,   originalPrice: 20,   category: 'books',       rating: 4.7, reviewCount: 5432,  image: 'https://picsum.photos/seed/book3/300/300',   inStock: true,  tags: ['productivity', 'self-help'] },
    { id: '22', name: 'Dune',                     price: 14,                        category: 'books',       rating: 4.8, reviewCount: 9876,  image: 'https://picsum.photos/seed/book4/300/300',   inStock: true,  tags: ['sci-fi', 'fiction'] },

    // Home
    { id: '23', name: 'Ceramic Coffee Mug Set',   price: 34,   originalPrice: 45,   category: 'home',        rating: 4.5, reviewCount: 2341, image: 'https://picsum.photos/seed/mug/300/300',      inStock: true,  tags: ['kitchen', 'ceramic'] },
    { id: '24', name: 'Scented Candle Collection',price: 49,                        category: 'home',        rating: 4.6, reviewCount: 1876, image: 'https://picsum.photos/seed/candle/300/300',   inStock: true,  tags: ['decor', 'aromatherapy'] },
    { id: '25', name: 'Bamboo Cutting Board',     price: 29,   originalPrice: 39,   category: 'home',        rating: 4.3, reviewCount: 987,  image: 'https://picsum.photos/seed/board/300/300',    inStock: true,  tags: ['kitchen', 'eco'] },
    { id: '26', name: 'Throw Pillow Set',          price: 59,                       category: 'home',        rating: 4.4, reviewCount: 654,  image: 'https://picsum.photos/seed/pillow/300/300',   inStock: false, tags: ['decor', 'bedroom'] },

    // Sports
    { id: '27', name: 'Yoga Mat Premium',         price: 79,   originalPrice: 99,   category: 'sports',      rating: 4.7, reviewCount: 3210, image: 'https://picsum.photos/seed/yoga/300/300',      inStock: true,  tags: ['yoga', 'fitness'] },
    { id: '28', name: 'Resistance Band Set',      price: 29,   originalPrice: 39,   category: 'sports',      rating: 4.5, reviewCount: 2134, image: 'https://picsum.photos/seed/bands/300/300',     inStock: true,  tags: ['fitness', 'home-gym'] },
    { id: '29', name: 'Football Pro',             price: 49,                        category: 'sports',      rating: 4.6, reviewCount: 1543, image: 'https://picsum.photos/seed/football/300/300',  inStock: true,  tags: ['football', 'outdoor'] },
    { id: '30', name: 'Water Bottle 1L',          price: 34,   originalPrice: 45,   category: 'sports',      rating: 4.4, reviewCount: 4321, image: 'https://picsum.photos/seed/bottle/300/300',    inStock: true,  tags: ['hydration', 'outdoor'] },
  ];
  return data;
};

export const PRODUCTS = generateProducts();

export type SortOption = 'default' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
