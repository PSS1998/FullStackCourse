const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')


blogRouter.get('/', async (request, response) => {
	const blogs = await Blog
		.find({})
		.populate('user', { username: 1, name: 1 })
	
	response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
	const body = request.body
	const user = request.user;

	const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
	})

  const result = await blog.save()
	if(result) {
		user.blogs = user.blogs.concat(result._id)  
		await user.save()
		response.status(201).json(result)
	} else {
		response.status(400).end()
	}
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
	const user = request.user;
	const blog = await Blog.findById(request.params.id).populate('user')

	if ( blog.user.username.toString() === user.username.toString() ) {
		await blog.remove()
		return response.status(204).end()
	} else {
		return response.status(401).end()
	}
})

blogRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})


module.exports = blogRouter
