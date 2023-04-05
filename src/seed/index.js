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
    ]
}

module.exports = initialData;

