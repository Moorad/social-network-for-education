import chai from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';
import app from '../index';
chai.use(chaiHttp);
chai.should();

let cookie: string;
let imageURL: string;

before((done) => {
	chai.request(app)
		.post('/auth/login')
		.send({
			email: 'bob@mail.com',
			password: 'bob123',
		})
		.set('Content-Type', 'application/json')
		.end((err, res) => {
			cookie = res.header['set-cookie'][0];
			done();
		});
});

describe('/resource API routes', () => {
	describe('/:id API tests', () => {
		it('should test /:id with the default image', (done) => {
			chai.request(app)
				.get('/resource/default')
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);
					res.body.should.be.instanceof(Buffer);
					done();
				});
		});

		it('should test /:id with a test account image', (done) => {
			chai.request(app)
				.get('/resource/70bb12c5-5084-4f73-8302-451a2764e3e2')
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);
					res.body.should.be.instanceof(Buffer);
					done();
				});
		});

		it('should test /:id with an invalid id', (done) => {
			chai.request(app)
				.get('/resource/123')
				.end((err, res) => {
					chai.expect(res.status).to.equal(404);
					done();
				});
		});
	});

	describe('/upload API tests', () => {
		it('should test /upload with a valid image', (done) => {
			const imagePath = path.resolve(
				__dirname,
				'../../file_manager/media/70bb12c5-5084-4f73-8302-451a2764e3e2.png'
			);
			chai.request(app)
				.post('/resource/upload?for=Avatar')
				.set('Content-Type', 'multipart/form-data')
				.set('Cookie', cookie)
				.attach('file', imagePath)
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);
					chai.expect(res.body.url).to.match(
						/http:\/\/localhost:4000\/resource\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/gm
					);
					imageURL = res.body.url;

					done();
				});
		});

		it('should test if avatar image changed', (done) => {
			chai.request(app)
				.get('/user')
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);
					chai.expect(res.body.avatar).to.equal(imageURL);
					done();
				});
		});

		it('should test /upload with file type that is not allowed', (done) => {
			const exeFile = Buffer.from('data');
			chai.request(app)
				.post('/resource/upload?for=Avatar')
				.set('Cookie', cookie)
				.attach('file', exeFile, 'test.exe')
				.end((err, res) => {
					chai.expect(res.status).to.equal(400);
					done();
				});
		});

		it('should test /upload no file', (done) => {
			chai.request(app)
				.post('/resource/upload')
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(400);
					done();
				});
		});
	});
});
