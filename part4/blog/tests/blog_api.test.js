const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)


const getToken = async () => {
  const request = await api.post("/api/login").send({
    username: helper.testUser().username,
    password: helper.testUser().password
  });
  return `Bearer ${request.body.token}`;
}

describe('when some initial blogs are already stored', () => {
	beforeEach(async () => {
		await Blog.deleteMany({})
		await User.deleteMany({});
		const user = await api.post('/api/users').send(helper.testUser())

		await Blog.insertMany(
			helper.initialBlogs.map(blog => ({...blog, user: user.body.id }))
		)
	})

	test('blogs are retrieved as json', async () => {
		const result = await api.get('/api/blogs');
		expect(result.body).toHaveLength(helper.initialBlogs.length);
	}, 100000)

	test('blogs include unique id property', async () => {
		const result = await api.get('/api/blogs');
		result.body.forEach(blog => {
			expect(blog.id).toBeDefined();
			expect(blog._id).toBeUndefined();
		})
	}, 300000)

	test('a valid blog post can be added', async () => {
		const token = await getToken()
		const newPost = {
			'title': "Fresh post",
			'author': "John Doe",
			'url': "http://example.com",
			'likes': 20
		}

		await api
			.post('/api/blogs')
			.send(newPost)
			.set('Authorization', token)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const result = await api.get('/api/blogs')

		const url = result.body.map(r => r.url)

		expect(result.body).toHaveLength(helper.initialBlogs.length + 1)
		expect(url).toContainEqual('http://example.com')
	})

	test('a blog post without likes defaults to 0', async () => {
		const token = await getToken()

		const newPost = {
			'title': "Unpopular post",
			'author': "John Doe",
			'url': "http://no-likes.com"
		}

		await api
			.post('/api/blogs')
			.send(newPost)
			.set('Authorization', token)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const result = await api.get('/api/blogs')

		const blog = result.body.find(x => x.title === 'Unpopular post')

		expect(result.body).toHaveLength(helper.initialBlogs.length + 1)
		expect(blog).toBeDefined()
		expect(blog.likes).toEqual(0)
	})

	test('blog post without title or url is not added', async () => {
		const token = await getToken()

		const newPosts = [
			{
				'author': "John Doe",
				'url': "http://incomplete-post.com",
				'likes': 0,
			},
			{
				'title': "Incomplete Post",
				'author': "John Doe",
				'likes': 0
			}]

		for (let newPost of newPosts) {
			await api
				.post('/api/blogs')
				.send(newPost)
				.set('Authorization', token)
				.expect(400)

			const result = await api.get('/api/blogs')
			expect(result.body).toHaveLength(helper.initialBlogs.length)
		}
	})

	test('blog post can be deleted by id', async () => {
		const token = await getToken()

		const resp = await api.get('/api/blogs');
		const blog = resp.body[0]

		await api
			.delete(`/api/blogs/${blog.id}`)
			.set('Authorization', token)
			.expect(204)

		const result = await api.get('/api/blogs')
		expect(result.body).toHaveLength(helper.initialBlogs.length - 1)
		expect(result.body.find(x => x.title === blog.title)).toBeUndefined()
	})

	test('blog post can be updated by id', async () => {
		const token = await getToken()

		const resp = await api.get('/api/blogs');
		const blog = resp.body[0]

		const result = await api .put(`/api/blogs/${blog.id}`)
			.send({ 'likes': blog.likes + 1 })
			.set('Authorization', token)
			.expect(200)

		expect(result.body.likes).toEqual(blog.likes + 1);
	})

	test('blog post cannot be added when not logged in', async () => {
		const resp = await api.get('/api/blogs');
		const blog = resp.body[0]

		await api
			.delete(`/api/blogs/${blog.id}`)
			.expect(401)
	})

	test('blog post cannot be deleted by user other than the author', async () => {
		const token = await api.get('/api/login').send(helper.testUser())
		const resp = await api.get('/api/blogs');
		const blog = resp.body[0]

		const result = await api .put(`/api/blogs/${blog.id}`)
			.send({ 'likes': blog.likes + 1 })
			.set('Authorization', `Token ${token.body.token}`)
			.expect(200)

		expect(result.body.likes).toEqual(blog.likes + 1);
	})
})

describe('when there is initially one user in db', () => {
	beforeEach(async () => {
		await User.deleteMany({})

		const passwordHash = await bcrypt.hash('sekret', 10)
		const user = new User({ username: 'root', passwordHash })

		await user.save()
	}, 3000000)

	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
			password: 'salainen',
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

		const usernames = usersAtEnd.map(u => u.username)
		expect(usernames).toContain(newUser.username)
	}, 3000000)

	test('creation fails with proper statuscode and message if username already taken', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'root',
			name: 'Superuser',
			password: 'salainen',
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(result.body.error).toContain('username must be unique')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toEqual(usersAtStart)
	}, 3000000)


	test('creation fails if username is too short', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
		username: 'sh',
		name: 'Superuser',
		password: 'salainen',
		}

		const result = await api
		.post('/api/users')
		.send(newUser)
		.expect(400)
		.expect('Content-Type', /application\/json/)

		expect(result.body.error).toContain('username')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toEqual(usersAtStart)
	}, 3000000)


	test('creation fails if password is too short', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'root',
			name: 'Superuser',
			password: 'sh',
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(result.body.error).toContain('password must be longer than 3 characters')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toEqual(usersAtStart)
	}, 3000000)

	test('creation fails if username is not unique', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: usersAtStart[0].username,
			name: 'Superuser',
			password: 'notimportant',
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(result.body.error).toContain('username must be unique')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toEqual(usersAtStart)
	}, 3000000)
})


afterAll(() => {
  mongoose.connection.close()
})
