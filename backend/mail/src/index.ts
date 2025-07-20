import express from 'express';
import { PORT } from './config/constants.js';
import { startSendOTPConsumer } from './consumer.js';

const app = express();

app.use(express.json())


const port = PORT || 5001;

startSendOTPConsumer();


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})