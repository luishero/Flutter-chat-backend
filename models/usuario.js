const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    online: {
        type: Boolean,
        default: false
    },

});

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...objectito } = this.toObject();
    objectito.uid = _id;
    return objectito;
})

module.exports = model('Usuario', UsuarioSchema );




//module.exports = model('Usuario', UsuarioSchema );const { Schema, model } = require('mongoose');