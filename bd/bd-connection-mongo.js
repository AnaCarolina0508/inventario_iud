const mongoose = require('mongoose');

const getConnection = async () => {
    try {
        const url = 'mongodb://user_bd:XJ6k9KSUrtp0LQAC@ac-lcrit3q-shard-00-00.cepsxzr.mongodb.net:27017,ac-lcrit3q-shard-00-01.cepsxzr.mongodb.net:27017,ac-lcrit3q-shard-00-02.cepsxzr.mongodb.net:27017/inventarios-iud?ssl=true&replicaSet=atlas-aqzbbc-shard-0&authSource=admin&retryWrites=true&w=majority';

        await mongoose.connect(url);
        
        console.log('Conexion exitosa');
        
    } catch (error) {
        console.log(error); 
    }

}

module.exports = {
    getConnection,
}