const bcrypt = require('bcrypt');

const initialData = {
    users: [
        {
            firstName: 'Anaís',
            lastName: 'Reyes',
            email: 'areyes@nostromo.com',
            password: bcrypt.hashSync('123456', 10),
            role: 'client'
        },
        {
            firstName: 'Emilio',
            lastName: 'Emilio de Leon',
            email: 'eleon@nostromo.com',
            password: bcrypt.hashSync('123456', 10),
            role: 'client'
        },
        {
            firstName: 'Yael',
            lastName: 'Ruiz',
            email: 'yruiz@nostromo.com',
            password: bcrypt.hashSync('123456', 10),
            role: 'admin'
        },
        {
            firstName: 'Alfredo',
            lastName: 'Altamirano',
            email: 'aaltamirano@nostromo.com',
            password: bcrypt.hashSync('123456', 10),
            role: 'admin'
        },
    ],
    products: [
        {
            title: 'Jarro de Barro negro',
            description: 'La cerámica de barro negro o cerámica negra mexicana forma parte de la producción alfarera tradicional de Oaxaca',
            slug: 'jarro_de_barro_negro',
            inStock: 10,
            price: 300,
            sizes: [
                'small',
                'medium',
            ],
            tags: [
                'jarro',
                'negro',
                'oaxaca'
            ],
            images: [
                'https://mexicorutamagica.mx/wp-content/uploads/2020/11/museodeartepopular_valle_123295357_366546204581943_4314429298067730236_n-copia.jpg',
                'https://mexicorutamagica.mx/wp-content/uploads/2020/11/artedelavida_70379295_602874387200538_2540033968872114230_n.jpg'
            ]
        },
        {
            title: 'Alebrijes',
            description: 'El alebrije es una artesanía mexicana hecha tradicionalmente con la técnica de la cartonería. Se trata de una figura fantástica que combina elementos fisionómicos de varios animales, ya sean reales o imaginarios, y se caracterizan por estar pintados de colores vibrantes.',
            slug: 'alebrijes',
            inStock: 20,
            price: 250,
            sizes: [
                'small',
                'medium',
            ],
            tags: [
                'Alebrijes',
                'figuras',
            ],
            images: [
                'https://mymodernmet.com/wp/wp-content/uploads/2019/05/Alebrijes-1-e1558455347541.jpg'
            ]
        },
        {
            title: 'Piñata',
            description: 'Las piñatas son conocidas internacionalmente pero no siempre se conoce que se usan para festejar las Posadas en fechas navideñas, además de en los cumpleaños de los niños.',
            slug: 'pinata',
            inStock: 40,
            price: 350,
            sizes: [
                'small',
                'medium',
                'large',
            ],
            tags: [
                'piñata',
                'estrella',
            ],
            images: [
                'https://www.turismomexico.es/wp-content/uploads/2019/01/pinata_mexicana.jpg'
            ]
        }
    ]
}

module.exports = initialData;

