import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
chai.use(chaiHttp);
chai.should();

let cookie: string;
let michealId: string;
let michealPostId: string;

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

					chai.request(app)
						.get(`/user/posts?id=${michealId}`)
						.set('Cookie', cookie)
						.end((err, res) => {
							michealPostId = res.body.posts[0]._id;
							done();
						});
				});
		});
});

describe('/post API routes', () => {
	describe('POST /post/ API tests', () => {
		it('should test post creation through /posts/', (done) => {
			chai.request(app)
				.post('/post/')
				.send({
					title: 'Test post',
					description: 'Test description',
				})
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);
					done();
				});
		});

		it('should test if the post from the previous test exists', (done) => {
			// No way rn to get a singular post
			chai.request(app)
				.get('/user/posts')
				.set('Cookie', cookie)
				.end((err, res) => {
					res.body.should.have.property('posts').with.lengthOf(2);
					res.body.should.have.property('user');

					chai.expect(res.body.posts[1].title).to.equal('Test post');
					chai.expect(res.body.posts[1].description).to.equal(
						'Test description'
					);
					done();
				});
		});

		it('should test /post/ for missing property', (done) => {
			chai.request(app)
				.post('/post/')
				.send({
					description: 'description!',
				})
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(400);
					done();
				});
		});

		it('should test /post/ with missing access token', (done) => {
			chai.request(app)
				.post('/post/')
				.send({
					title: 'Test post',
					description: 'description!',
				})
				.end((err, res) => {
					chai.expect(res.status).to.equal(401);
					done();
				});
		});
	});

	describe('GET /post API tests', () => {
		it('should test /post with a post id', (done) => {
			chai.request(app)
				.get(`/post?id=${michealPostId}`)
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);

					res.body.should.have.all.keys('post', 'user');
					chai.expect(res.body.post).to.not.be.empty;
					chai.expect(res.body.user).to.not.be.empty;
					done();
				});
		});

		it('should test /post with an invalid post id', (done) => {
			chai.request(app)
				.get('/post?id=123')
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(404);
					done();
				});
		});

		it('should test /post with missing id', (done) => {
			chai.request(app)
				.get('/post')
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(400);
					done();
				});
		});

		it('should test /post with a valid ObjectID structure that does not exist in the database', (done) => {
			chai.request(app)
				.get('/post?id=6366deff5c1ae5ecca48a3aa')
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(404);
					done();
				});
		});
	});

	describe('/like API tests', () => {
		it("should test liking another user's post", (done) => {
			chai.request(app)
				.get(`/post/like?postId=${michealPostId}`)
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);
					done();
				});
		});

		it("should test like that was set on the previous test's post", (done) => {
			chai.request(app)
				.get(`/post?id=${michealPostId}`)
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);

					res.body.post.should.have.property('likes').with.length(1);
					res.body.post.likeCount.should.equal(1);
					done();
				});
		});

		it("should test unliking the previous test's post", (done) => {
			chai.request(app)
				.get(`/post/like?postId=${michealPostId}`)
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);
					done();
				});
		});

		it("should test unlike that was set on the previous test's post", (done) => {
			chai.request(app)
				.get(`/post?id=${michealPostId}`)
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(200);

					res.body.post.should.have.property('likes').with.length(0);

					res.body.post.likeCount.should.equal(0);
					done();
				});
		});

		it('should test likes on invalid post ids', () => {
			chai.request(app)
				.get('/post/like?postId=123')
				.set('Cookie', cookie)
				.end((err, res) => {
					chai.expect(res.status).to.equal(404);
				});
		});
	});
});
