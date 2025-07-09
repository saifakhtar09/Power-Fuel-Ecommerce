import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'PowerMax Whey Isolate',
    description: 'Pure whey protein isolate with 25g protein per serving. Perfect for post-workout recovery and muscle building.',
    price: 59.99,
    image: '/assets/PlantigoListingPerformanceProtein-01.webp',
    category: 'Whey Protein',
    flavors: ['Vanilla', 'Chocolate', 'Strawberry', 'Cookies & Cream'],
    sizes: [
      { size: '2 lbs', servings: 30, price: 59.99 },
      { size: '5 lbs', servings: 75, price: 129.99 },
      { size: '10 lbs', servings: 150, price: 239.99 }
    ],
    nutrition: {
      protein: 25,
      calories: 120,
      carbs: 2,
      fat: 1,
      sugar: 1
    },
    rating: 4.8,
    reviews: 2847
  },
  {
    id: '2',
    name: 'Plant Power Vegan Blend',
    description: 'Complete plant-based protein blend with 22g protein per serving. Made from pea, rice, and hemp proteins for optimal amino acid profile.',
    price: 49.99,
    image: '/assets/whey-protein-1067x800.png',
    category: 'Plant Protein',
    flavors: ['Vanilla', 'Chocolate', 'Berry Blast'],
    sizes: [
      { size: '2 lbs', servings: 28, price: 49.99 },
      { size: '5 lbs', servings: 70, price: 109.99 }
    ],
    nutrition: {
      protein: 22,
      calories: 110,
      carbs: 4,
      fat: 2,
      sugar: 2
    },
    rating: 4.6,
    reviews: 1523
  },
  {
    id: '3',
    name: 'Casein Night Formula',
    description: 'Slow-digesting casein protein perfect for overnight muscle recovery. Provides sustained amino acid release for 8+ hours.',
    price: 54.99,
    image: '/assets/images.jpg',
    category: 'Casein Protein',
    flavors: ['Vanilla', 'Chocolate', 'Caramel'],
    sizes: [
      { size: '2 lbs', servings: 32, price: 54.99 },
      { size: '4 lbs', servings: 64, price: 99.99 }
    ],
    nutrition: {
      protein: 24,
      calories: 130,
      carbs: 3,
      fat: 1,
      sugar: 2
    },
    rating: 4.7,
    reviews: 892
  },
  {
    id: '4',
    name: 'Mass Gainer Extreme',
    description: 'High-calorie mass gainer with 50g protein and 250g carbs. Perfect for hardgainers looking to build serious size.',
    price: 69.99,
    image: '/assets/istockphoto-1360059155-612x612.jpg',
    category: 'Mass Gainer',
    flavors: ['Chocolate', 'Vanilla', 'Banana'],
    sizes: [
      { size: '5 lbs', servings: 16, price: 69.99 },
      { size: '12 lbs', servings: 38, price: 149.99 }
    ],
    nutrition: {
      protein: 50,
      calories: 1250,
      carbs: 252,
      fat: 5,
      sugar: 20
    },
    rating: 4.5,
    reviews: 654
  },
  {
    id: '5',
    name: 'Pure Creatine Monohydrate',
    description: 'Micronized creatine monohydrate for increased strength, power, and muscle volume. Unflavored and mixes easily.',
    price: 29.99,
    image: '/assets/NATURALTEIN-Creapure-power.webp',
    category: 'Creatine',
    flavors: ['Unflavored'],
    sizes: [
      { size: '300g', servings: 60, price: 29.99 },
      { size: '500g', servings: 100, price: 44.99 }
    ],
    nutrition: {
      protein: 0,
      calories: 0,
      carbs: 0,
      fat: 0,
      sugar: 0
    },
    rating: 4.9,
    reviews: 3241
  },
  {
    id: '6',
    name: 'Pre-Workout Ignite',
    description: 'High-stim pre-workout with caffeine, beta-alanine, and citrulline for explosive energy and pumps.',
    price: 39.99,
    image: '/assets/61gBVPq2MtL._UF350,350_QL80_.jpg',
    category: 'Pre-Workout',
    flavors: ['Blue Razz', 'Watermelon', 'Green Apple'],
    sizes: [
      { size: '300g', servings: 30, price: 39.99 },
      { size: '600g', servings: 60, price: 69.99 }
    ],
    nutrition: {
      protein: 0,
      calories: 5,
      carbs: 1,
      fat: 0,
      sugar: 0
    },
    rating: 4.7,
    reviews: 1876
  }
];