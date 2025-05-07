
import app from './src/app.js';
import { config } from './src/config/config.js';
import { initializeSocket } from './src/services/socket.js';

const server = initializeSocket(app);


server.listen(config.PORT,()=>{
    console.log("server running on port :",config.PORT)
})