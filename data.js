// Datos de productos para TerraCart
const products = [
    {
        id: 1,
        name: 'Tomates Orgánicos (1kg)',
        price: 3.50,
        image: 'img/tomates.png',
        category: 'verduras',
        description: 'Tomates cultivados de forma orgánica sin pesticidas ni químicos.',
        impact: {
            waterSaved: 20,
            co2Saved: 0.5,
            isPlasticFree: true,
            isLocal: true,
            isOrganic: true
        },
        tags: ['orgánico', 'local', 'sin plástico']
    },
    {
        id: 2,
        name: 'Leche de Avena (1L)',
        price: 2.80,
        image: 'img/leche-avena.png',
        category: 'bebidas',
        description: 'Leche vegetal de avena, alternativa sostenible a la leche animal.',
        impact: {
            waterSaved: 50,
            co2Saved: 1.2,
            isPlasticFree: false,
            isLocal: false,
            isOrganic: true
        },
        tags: ['vegano', 'orgánico']
    },
    {
        id: 3,
        name: 'Shampoo Sólido',
        price: 8.00,
        image: 'img/shampoo-solido.png',
        category: 'cuidado personal',
        description: 'Shampoo natural en formato sólido, cero plástico y duradero.',
        impact: {
            waterSaved: 5,
            co2Saved: 0.3,
            isPlasticFree: true,
            isLocal: true,
            isOrganic: true
        },
        tags: ['sin plástico', 'local', 'orgánico']
    },
    {
        id: 4,
        name: 'Huevos Camperos (6 unidades)',
        price: 4.20,
        image: 'img/huevos.png',
        category: 'huevos',
        description: 'Huevos de gallinas criadas en libertad, alimentación natural.',
        impact: {
            waterSaved: 10,
            co2Saved: 0.8,
            isPlasticFree: true,
            isLocal: true,
            isOrganic: false
        },
        tags: ['local', 'sin plástico']
    },
    {
        id: 5,
        name: 'Pan Integral de Masa Madre',
        price: 3.50,
        image: 'img/pan-integral.png',
        category: 'panadería',
        description: 'Pan artesanal con fermentación natural, sin conservantes.',
        impact: {
            waterSaved: 15,
            co2Saved: 0.4,
            isPlasticFree: true,
            isLocal: true,
            isOrganic: true
        },
        tags: ['local', 'sin plástico', 'orgánico']
    },
    {
        id: 6,
        name: 'Aceite de Oliva Virgen Extra (500ml)',
        price: 12.50,
        image: 'img/aceite.png',
        category: 'aceites',
        description: 'Aceite de oliva de primera prensada en frío, producción ecológica.',
        impact: {
            waterSaved: 30,
            co2Saved: 1.5,
            isPlasticFree: false,
            isLocal: false,
            isOrganic: true
        },
        tags: ['orgánico']
    },
    {
        id: 7,
        name: 'Detergente Ecológico (1L)',
        price: 6.80,
        image: 'img/detergente.png',
        category: 'limpieza',
        description: 'Detergente biodegradable, eficaz y respetuoso con el medio ambiente.',
        impact: {
            waterSaved: 25,
            co2Saved: 0.7,
            isPlasticFree: false,
            isLocal: false,
            isOrganic: false
        },
        tags: ['biodegradable']
    },
    {
        id: 8,
        name: 'Manzanas Ecológicas (1kg)',
        price: 4.20,
        image: 'img/manzanas.png',
        category: 'frutas',
        description: 'Manzanas de cultivo ecológico, dulces y crujientes.',
        impact: {
            waterSaved: 18,
            co2Saved: 0.6,
            isPlasticFree: true,
            isLocal: true,
            isOrganic: true
        },
        tags: ['orgánico', 'local', 'sin plástico']
    },
    {
        id: 9,
        name: 'Yogur de Coco Natural',
        price: 3.20,
        image: 'img/yogur-coco.png',
        category: 'lácteos vegetales',
        description: 'Yogur vegetal de coco, sin lactosa y cremoso.',
        impact: {
            waterSaved: 40,
            co2Saved: 1.0,
            isPlasticFree: false,
            isLocal: false,
            isOrganic: true
        },
        tags: ['vegano', 'orgánico']
    },
    {
        id: 10,
        name: 'Cepillo de Bambú',
        price: 4.50,
        image: 'img/cepillo-bambu.png',
        category: 'cuidado personal',
        description: 'Cepillo de dientes de bambú biodegradable con cerdas naturales.',
        impact: {
            waterSaved: 2,
            co2Saved: 0.2,
            isPlasticFree: true,
            isLocal: false,
            isOrganic: false
        },
        tags: ['biodegradable', 'sin plástico']
    },
    {
        id: 11,
        name: 'Quinoa Real (500g)',
        price: 5.80,
        image: 'img/quinoa.png',
        category: 'granos',
        description: 'Quinoa de cultivo sostenible, alto valor nutricional.',
        impact: {
            waterSaved: 35,
            co2Saved: 0.9,
            isPlasticFree: true,
            isLocal: false,
            isOrganic: true
        },
        tags: ['orgánico', 'sin plástico']
    },
    {
        id: 12,
        name: 'Jabón Natural de Lavanda',
        price: 4.80,
        image: 'img/jabon-lavanda.png',
        category: 'cuidado personal',
        description: 'Jabón artesanal con aceites esenciales de lavanda, sin químicos.',
        impact: {
            waterSaved: 8,
            co2Saved: 0.4,
            isPlasticFree: true,
            isLocal: true,
            isOrganic: true
        },
        tags: ['orgánico', 'local', 'sin plástico']
    }
];

// Categorías para filtros
const categories = [
    'todos',
    'verduras',
    'frutas',
    'bebidas',
    'cuidado personal',
    'huevos',
    'panadería',
    'aceites',
    'limpieza',
    'lácteos vegetales',
    'granos'
];

// Configuración de la aplicación
const APP_CONFIG = {
    itemsPerPage: 8,
    shippingThreshold: 50, // Envío gratis a partir de 50 dolares
    shippingCost: 4.99,
    treesPerEuro: 0.1 // Árboles equivalentes por dolares gastado
};