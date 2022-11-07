import * as dotenv from 'dotenv';
import app from '../index';
import chaiHTTP from 'chai-http';
import chai from 'chai';
import { connectToDB, resetDB } from '../tools/database';
dotenv.config();
chai.use(chaiHTTP);
chai.should();

let accessToken: string;

before(async () => {
	await connectToDB('/test');
	await resetDB();
	return;
});

describe('/auth API routes', () => {
	describe('/register API tests', () => {
		it('should test /register with valid credentials', (done) => {
			chai.request(app)
				.post('/auth/register')
				.send({
					displayName: 'Test',
					email: 'test@mail.com',
					password: 'test123',
				})
				.set('Content-Type', 'application/json')
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);
					accessToken = res.body.accessToken;
					done();
				});
		});

		it('should test /register with an existing account', (done) => {
			chai.request(app)
				.post('/auth/register')
				.send({
					displayName: 'Test',
					email: 'test@mail.com',
					password: 'test123',
				})
				.set('Content-Type', 'application/json')
				.end((err, res) => {
					chai.expect(res.status).to.equal(403);
					done();
				});
		});

		it('should test /register with a missing property', (done) => {
			chai.request(app)
				.post('/auth/register')
				.send({
					email: 'test@mail.com',
					password: 'test123',
				})
				.set('Content-Type', 'application/json')
				.end((err, res) => {
					chai.expect(res.status).to.equal(400);
					done();
				});
		});
	});

	describe('/login API tests', () => {
		it('should test /login with valid credentials', (done) => {
			chai.request(app)
				.post('/auth/login')
				.send({
					email: 'test@mail.com',
					password: 'test123',
				})
				.set('Content-Type', 'application/json')
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);
					res.body.accessToken.should.be.a('string');
					done();
				});
		});

		it('should test /login with invalid credentials', (done) => {
			chai.request(app)
				.post('/auth/login')
				.send({
					email: 'doesnt@exist.com',
					password: 'pass',
				})
				.set('Content-Type', 'application/json')
				.end((err, res) => {
					chai.expect(res.status).to.equal(403);
					done();
				});
		});

		it('should test /login with a missing email property', (done) => {
			chai.request(app)
				.post('/auth/login')
				.send({
					password: 'test123',
				})
				.set('Content-Type', 'application/json')
				.end((err, res) => {
					chai.expect(res.status).to.equal(400);
					done();
				});
		});

		it('should test /login with a missing password property', (done) => {
			chai.request(app)
				.post('/auth/login')
				.send({
					email: 'test@mail.com',
				})
				.set('Content-Type', 'application/json')
				.end((err, res) => {
					chai.expect(res.status).to.equal(400);
					done();
				});
		});
	});

	describe('/token API tests', () => {
		it('should test /token with no cookie', (done) => {
			chai.request(app)
				.get('/auth/token')
				.end((err, res) => {
					chai.expect(res.status).to.equal(401);
					done();
				});
		});

		it('should test /token with the token given earlier', (done) => {
			chai.request(app)
				.get('/auth/token')
				.set('Cookie', `token=${accessToken}; Path=/; HttpOnly;`)
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);
					done();
				});
		});

		it('should test /token with an invalid cookie', (done) => {
			chai.request(app)
				.get('/auth/token')
				.set('Cookie', `token=${accessToken + '0'}; Path=/; HttpOnly;`)
				.end((err, res) => {
					chai.expect(res.status).to.equal(403);
					done();
				});
		});
	});

	describe('/logout API tests', () => {
		it('should test /logout with a given cookie', (done) => {
			chai.request(app)
				.get('/auth/logout')
				.set('Cookie', `token=${accessToken}; Path=/; HttpOnly;`)
				.end((err, res) => {
					chai.expect(res.header['set-cookie'][0]).to.equal(
						'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
					);
					done();
				});
		});
	});
});
