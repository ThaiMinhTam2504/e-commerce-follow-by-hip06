const { default: mongoose } = require('mongoose');

const dbConnect = async () => {
    try {

        const conn = await mongoose.connect(process.env.MONGODB_URI)
        if (conn.connection.readyState === 1) {
            console.log('DB connect is successful')
        } else {
            console.log('DB connect is failed')
        }

    } catch (error) {
        console.log('DB connect is failed:')
        throw new Error(error)
    }
}

module.exports = dbConnect;