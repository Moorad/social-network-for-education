import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(cors());
app.use(express.json())
app.use(morgan('dev'))


app.listen((process.env.PORT || '4000'), () => {
	console.log(`Server listening on port ${(process.env.PORT || '4000')}`);
});

app.post('/api/register', (req, res) => {
	console.log(req.body);

	// res.statusCode = 402;
	res.json({
		message: "ok"
	})

})
