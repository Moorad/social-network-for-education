import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
chai.use(chaiHttp);
chai.should();

let cookie: string;
let michealId: string;

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
			chai.request(app)
				.get('/utils/search?term=Micheal')
				.set('Cookie', cookie)
				.end((err, res) => {
					michealId = res.body.results[0]._id;
					done();
				});
		});
});

describe('/user API routes', () => {
	describe('/user/ API tests', () => {
		it('should test /user/ on self (no ID provided)', (done) => {
			chai.request(app)
				.get('/user')
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);

					res.body.displayName.should.equal('Bob');
					res.body.should.have.all.keys(
						'displayName',
						'description',
						'label',
						'followerCount',
						'followingCount',
						'posts',
						'avatar',
						'_id',
						'isPrivate'
					);
					res.body.should.not.have.property('email');
					res.body.should.not.have.property('password');
					done();
				});
		});

		it('should test /user/ on another user', (done) => {
			chai.request(app)
				.get(`/user?id=${michealId}`)
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);

					res.body.displayName.should.equal('Micheal');
					res.body.should.have.all.keys(
						'displayName',
						'description',
						'label',
						'followerCount',
						'followingCount',
						'posts',
						'avatar',
						'_id',
						'isPrivate'
					);

					res.body.should.not.have.property('email');
					res.body.should.not.have.property('password');
					done();
				});
		});

		it('should test /user/ on invalid user', (done) => {
			chai.request(app)
				.get('/user?id=123')
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(404);
					done();
				});
		});

		it('should test /user/ with a valid ObjectID structure that does not exist in the database', (done) => {
			chai.request(app)
				.get('/user?id=6366deff5c1ae5ecca48a3aa')
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(404);
					done();
				});
		});
	});

	describe('/posts API tests', () => {
		it('should test /posts on self (no ID provided)', (done) => {
			chai.request(app)
				.get('/user/posts')
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);
					res.body.should.have.property('posts').with.lengthOf(2);
					res.body.should.have.property('user');
					done();
				});
		});

		it('should test /posts on another user', (done) => {
			chai.request(app)
				.get(`/user/posts?id=${michealId}`)
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);
					res.body.should.have.property('posts').with.lengthOf(1);
					res.body.should.have.property('user');

					chai.expect(res.body.user._id).to.equal(michealId);
					done();
				});
		});

		it('should test /posts on invalid user', (done) => {
			chai.request(app)
				.get('/user/posts?id=123')
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(404);
					done();
				});
		});
	});
});
