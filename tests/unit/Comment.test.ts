import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Comment, CommentItem } from '../../src/components/Comment'

describe('Comment Component', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.className = 'comments'
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should initialize with default config', () => {
    const comment = new Comment()
    expect(comment.getName()).toBe('Comment')
  })

  it('should load comments from DOM', () => {
    const comment1 = document.createElement('div')
    comment1.setAttribute('data-comment', 'true')
    comment1.setAttribute('data-comment-id', 'c1')
    comment1.setAttribute('data-author', 'Alice')
    comment1.setAttribute('data-timestamp', String(Date.now()))
    comment1.textContent = 'Great article!'
    container.appendChild(comment1)

    const comment = new Comment()
    comment.init()
    const comments = comment.getComments()
    expect(comments.length).toBe(1)
    expect(comments[0].author).toBe('Alice')
  })

  it('should sort comments by newest', () => {
    const now = Date.now()
    const c1 = document.createElement('div')
    c1.setAttribute('data-comment', 'true')
    c1.setAttribute('data-comment-id', 'c1')
    c1.setAttribute('data-author', 'Alice')
    c1.setAttribute('data-timestamp', String(now - 1000))
    c1.textContent = 'First'
    container.appendChild(c1)

    const c2 = document.createElement('div')
    c2.setAttribute('data-comment', 'true')
    c2.setAttribute('data-comment-id', 'c2')
    c2.setAttribute('data-author', 'Bob')
    c2.setAttribute('data-timestamp', String(now))
    c2.textContent = 'Second'
    container.appendChild(c2)

    const comment = new Comment({ sortBy: 'newest' })
    comment.init()
    const comments = comment.getComments()
    expect(comments[0].author).toBe('Bob')
    expect(comments[1].author).toBe('Alice')
  })

  it('should add new comment', () => {
    const comment = new Comment()
    comment.init()

    const newComment: CommentItem = {
      id: 'c1',
      author: 'Charlie',
      content: 'Nice post!',
      timestamp: Date.now(),
    }

    comment.addComment(newComment)
    const comments = comment.getComments()
    expect(comments.length).toBe(1)
    expect(comments[0].author).toBe('Charlie')
  })

  it('should remove comment by id', () => {
    const comment = new Comment()
    comment.init()

    const newComment: CommentItem = {
      id: 'c1',
      author: 'Charlie',
      content: 'Nice post!',
      timestamp: Date.now(),
    }

    comment.addComment(newComment)
    expect(comment.getCommentCount()).toBe(1)

    comment.removeComment('c1')
    expect(comment.getCommentCount()).toBe(0)
  })

  it('should get comment count', () => {
    const comment = new Comment()
    comment.init()

    comment.addComment({
      id: 'c1',
      author: 'Alice',
      content: 'Comment 1',
      timestamp: Date.now(),
    })

    comment.addComment({
      id: 'c2',
      author: 'Bob',
      content: 'Comment 2',
      timestamp: Date.now(),
    })

    expect(comment.getCommentCount()).toBe(2)
  })

  it('should format time correctly', () => {
    const comment = new Comment()
    comment.init()

    const now = Date.now()
    const c1: CommentItem = {
      id: 'c1',
      author: 'Alice',
      content: 'Just now',
      timestamp: now - 5000, // 5 seconds ago
    }

    comment.addComment(c1)
    const comments = comment.getComments()
    expect(comments[0].timestamp).toBeLessThan(now)
  })

  it('should handle empty comments', () => {
    const comment = new Comment()
    comment.init()
    expect(comment.getCommentCount()).toBe(0)
    expect(comment.getComments()).toEqual([])
  })

  it('should update config', () => {
    const comment = new Comment({ sortBy: 'newest' })
    comment.init()

    comment.addComment({
      id: 'c1',
      author: 'Alice',
      content: 'Comment 1',
      timestamp: Date.now() - 1000,
    })

    comment.addComment({
      id: 'c2',
      author: 'Bob',
      content: 'Comment 2',
      timestamp: Date.now(),
    })

    comment.update({ sortBy: 'oldest' })
    const comments = comment.getComments()
    expect(comments[0].author).toBe('Alice')
  })

  it('should handle comment with avatar', () => {
    const comment = new Comment()
    comment.init()

    const newComment: CommentItem = {
      id: 'c1',
      author: 'Alice',
      avatar: 'https://example.com/avatar.jpg',
      content: 'Nice post!',
      timestamp: Date.now(),
    }

    comment.addComment(newComment)
    const comments = comment.getComments()
    expect(comments[0].avatar).toBe('https://example.com/avatar.jpg')
  })

  it('should handle comment with score', () => {
    const comment = new Comment()
    comment.init()

    const newComment: CommentItem = {
      id: 'c1',
      author: 'Alice',
      content: 'Nice post!',
      timestamp: Date.now(),
      score: 5,
    }

    comment.addComment(newComment)
    const comments = comment.getComments()
    expect(comments[0].score).toBe(5)
  })

  it('should destroy component', () => {
    const comment = new Comment()
    comment.init()
    comment.render()

    comment.addComment({
      id: 'c1',
      author: 'Alice',
      content: 'Comment',
      timestamp: Date.now(),
    })

    comment.destroy()
    expect(comment.getCommentCount()).toBe(0)
  })
})
