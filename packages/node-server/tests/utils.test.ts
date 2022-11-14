import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
chai.use(chaiHttp);
chai.should();

let cookie: string;

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

describe('/utils API routes', () => {
	describe('/search API tests', () => {
		it('should test /search with an exact match', (done) => {
			chai.request(app)
				.get('/utils/search?term=Micheal')
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);
					res.body.should.have.property('results').with.lengthOf(1);
					chai.expect(res.body.results[0].displayName).to.equal(
						'Micheal'
					);
					done();
				});
		});
		it('should test /search with an extra character', (done) => {
			chai.request(app)
				.get('/utils/search?term=Micheall')
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);
					res.body.should.have.property('results').with.lengthOf(1);
					chai.expect(res.body.results[0].displayName).to.equal(
						'Micheal'
					);
					done();
				});
		});

		it('should test /search with part of the string', (done) => {
			chai.request(app)
				.post('/auth/register')
				.send({
					displayName: 'Lilian Bernhard',
					email: 'lil@mail.com',
					password: 'lil123456',
				})
				.set('Content-Type', 'application/json')
				.end(() => {
					chai.request(app)
						.get('/utils/search?term=Lilian B')
						.set('Cookie', cookie)
						.end((err, res) => {
							chai.expect(res.status).to.equal(200);
							res.body.should.have
								.property('results')
								.with.lengthOf(1);
							chai.expect(
								res.body.results[0].displayName
							).to.equal('Lilian Bernhard');
							done();
						});
				});
		});

		it('should test /search with term does not match any user', (done) => {
			chai.request(app)
				.get('/utils/search?term=abc')
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);

					res.body.should.have.property('results').with.lengthOf(0);
					done();
				});
		});

		it('should test /search with missing term', (done) => {
			chai.request(app)
				.get('/utils/search')
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(400);
					done();
				});
		});
	});
});
