const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
	return blogs.reduce((prev, curr) => prev + curr.likes, 0)	
}

const favoriteBlog = (blogs) => {
	if (blogs.length !== 0) {
		let mostLikes = blogs[0]
		blogs.forEach(blog => {
			if(mostLikes.likes < blog.likes) {
				mostLikes = blog
			}}
		)

		return {
			'title': mostLikes.title,
			'author': mostLikes.author,
			'likes': mostLikes.likes
		}
	}
	else {
		return null
	}
}

const mostBlogs = (blogs) => {
	if (blogs.length !== 0) {
		let authors = blogs.reduce((obj, blog) => {
			obj[blog.author] = (obj[blog.author] || 0) + 1;
			return obj;
		}, {});
	
		let maxBlogs = Math.max(...Object.values(authors));
		let maxAuthor = Object.keys(authors).find(author => authors[author] === maxBlogs);
	
		return {
			'author': maxAuthor,
			'blogs': maxBlogs
		}
	}
	else {
		return null
	}
}

const mostLikes = (blogs) => {
	if (blogs.length !== 0) {
		let authors = blogs.reduce((obj, blog) => {
			obj[blog.author] = (obj[blog.author] || 0) + blog.likes;
			return obj;
		}, {});
	
		let maxAuthor = Object.entries(authors).sort((a, b) => a[1] - b[1]).pop();
	
		return {
			'author': maxAuthor[0],
			'likes': maxAuthor[1]
		}
    } else {
        return null
    }
}


module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
}
