import express from 'express'
import rootRouter from './routes';


const app = express()


app.use(express.json())

app.use(rootRouter);



app.get('/', (req, res) => {
    res.send("App is working");
})

app.listen( 3000, () => {
    console.log("App is working")
})