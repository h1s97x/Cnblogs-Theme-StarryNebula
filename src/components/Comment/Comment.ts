/**
 * Comment - 评论组件
 * 
 * 功能：
 * - 评论显示
 * - 评论加载
 * - 评论排序
 * - 评论分页
 */

import { BaseComponent, ComponentConfig } from '../BaseComponent'

export interface CommentItem {
  id: string
  author: string
  avatar?: string
  content: string
  timestamp: number
  replies?: CommentItem[]
  score?: number
}

export interface CommentConfig extends ComponentConfig {
  selector?: string
  sortBy?: 'newest' | 'oldest' | 'popular'
  pageSize?: number
  loadMore?: boolean
  nested?: boolean
}

export class Comment extends BaseComponent {
  private commentElement: HTMLElement | null = null
  private comments: CommentItem[] = []
  private displayedComments: CommentItem[] = []
  private currentPage: number = 1
  private sortBy: 'newest' | 'oldest' | 'popular' = 'newest'

  constructor(config: CommentConfig = {}) {
    super('Comment', {
      selector: '.comments',
      sortBy: 'newest',
      pageSize: 10,
      loadMore: true,
      nested: true,
      ...config,
    })

    this.sortBy = this.getConfigValue('sortBy', 'newest')
  }

  onInit(): void {
    this.loadComments()
    this.createCommentElement()
  }

  onRender(): void {
    this.renderComments()
    this.applyStyles()
  }

  onUpdate(config: CommentConfig): void {
    this.config = { ...this.config, ...config }
    if (config.sortBy) {
      this.sortBy = config.sortBy
      this.sortComments()
      this.renderComments()
    }
  }

  onDestroy(): void {
    if (this.commentElement) {
      this.commentElement.remove()
    }
    this.commentElement = null
    this.comments = []
  }

  /**
   * 加载评论
   */
  private loadComments(): void {
    const selector = this.getConfigValue('selector', '.comments')
    const container = document.querySelector(selector)
    if (!container) return

    // 从 DOM 中提取评论
    const commentElements = container.querySelectorAll('[data-comment]')
    this.comments = []

    commentElements.forEach((el) => {
      const comment: CommentItem = {
        id: el.getAttribute('data-comment-id') || `comment-${this.comments.length}`,
        author: el.getAttribute('data-author') || 'Anonymous',
        avatar: el.getAttribute('data-avatar'),
        content: el.textContent || '',
        timestamp: parseInt(el.getAttribute('data-timestamp') || String(Date.now())),
        score: parseInt(el.getAttribute('data-score') || '0'),
      }
      this.comments.push(comment)
    })

    this.sortComments()
  }

  /**
   * 排序评论
   */
  private sortComments(): void {
    switch (this.sortBy) {
      case 'oldest':
        this.comments.sort((a, b) => a.timestamp - b.timestamp)
        break
      case 'popular':
        this.comments.sort((a, b) => (b.score || 0) - (a.score || 0))
        break
      case 'newest':
      default:
        this.comments.sort((a, b) => b.timestamp - a.timestamp)
    }
  }

  /**
   * 创建评论元素
   */
  private createCommentElement(): void {
    this.commentElement = document.createElement('div')
    this.commentElement.className = 'comment-component'

    const mainContent = document.querySelector('main, #main, #mainContent')
    if (mainContent) {
      mainContent.appendChild(this.commentElement)
    } else {
      document.body.appendChild(this.commentElement)
    }

    this.setElement(this.commentElement)
  }

  /**
   * 渲染评论
   */
  private renderComments(): void {
    if (!this.commentElement) return

    this.commentElement.innerHTML = ''

    // 评论标题
    const title = document.createElement('h3')
    title.className = 'comment-title'
    title.textContent = `评论 (${this.comments.length})`
    this.commentElement.appendChild(title)

    // 排序选项
    const sortContainer = document.createElement('div')
    sortContainer.className = 'comment-sort'

    const sortLabel = document.createElement('label')
    sortLabel.textContent = '排序: '

    const sortSelect = document.createElement('select')
    sortSelect.className = 'comment-sort-select'
    sortSelect.value = this.sortBy

    const options = [
      { value: 'newest', label: '最新' },
      { value: 'oldest', label: '最早' },
      { value: 'popular', label: '最热' },
    ]

    options.forEach((opt) => {
      const option = document.createElement('option')
      option.value = opt.value
      option.textContent = opt.label
      sortSelect.appendChild(option)
    })

    sortSelect.addEventListener('change', (e) => {
      this.sortBy = (e.target as HTMLSelectElement).value as any
      this.sortComments()
      this.currentPage = 1
      this.renderComments()
    })

    sortContainer.appendChild(sortLabel)
    sortContainer.appendChild(sortSelect)
    this.commentElement.appendChild(sortContainer)

    // 评论列表
    const commentList = document.createElement('div')
    commentList.className = 'comment-list'

    if (this.comments.length === 0) {
      const noComments = document.createElement('div')
      noComments.className = 'comment-empty'
      noComments.textContent = '暂无评论'
      commentList.appendChild(noComments)
    } else {
      const pageSize = this.getConfigValue('pageSize', 10)
      const start = (this.currentPage - 1) * pageSize
      const end = start + pageSize
      this.displayedComments = this.comments.slice(start, end)

      this.displayedComments.forEach((comment) => {
        const commentItem = this.createCommentItem(comment)
        commentList.appendChild(commentItem)
      })
    }

    this.commentElement.appendChild(commentList)

    // 加载更多按钮
    if (this.getConfigValue('loadMore', true) && this.comments.length > this.currentPage * this.getConfigValue('pageSize', 10)) {
      const loadMoreBtn = document.createElement('button')
      loadMoreBtn.className = 'comment-load-more'
      loadMoreBtn.textContent = '加载更多'
      loadMoreBtn.addEventListener('click', () => {
        this.currentPage++
        this.renderComments()
      })
      this.commentElement.appendChild(loadMoreBtn)
    }
  }

  /**
   * 创建评论项
   */
  private createCommentItem(comment: CommentItem): HTMLElement {
    const item = document.createElement('div')
    item.className = 'comment-item'
    item.id = comment.id

    // 头部
    const header = document.createElement('div')
    header.className = 'comment-header'

    if (comment.avatar) {
      const avatar = document.createElement('img')
      avatar.className = 'comment-avatar'
      avatar.src = comment.avatar
      avatar.alt = comment.author
      header.appendChild(avatar)
    }

    const authorInfo = document.createElement('div')
    authorInfo.className = 'comment-author-info'

    const author = document.createElement('span')
    author.className = 'comment-author'
    author.textContent = comment.author
    authorInfo.appendChild(author)

    const time = document.createElement('span')
    time.className = 'comment-time'
    time.textContent = this.formatTime(comment.timestamp)
    authorInfo.appendChild(time)

    header.appendChild(authorInfo)
    item.appendChild(header)

    // 内容
    const content = document.createElement('div')
    content.className = 'comment-content'
    content.textContent = comment.content
    item.appendChild(content)

    // 底部
    const footer = document.createElement('div')
    footer.className = 'comment-footer'

    if (comment.score !== undefined) {
      const score = document.createElement('span')
      score.className = 'comment-score'
      score.textContent = `👍 ${comment.score}`
      footer.appendChild(score)
    }

    const reply = document.createElement('button')
    reply.className = 'comment-reply-btn'
    reply.textContent = '回复'
    reply.addEventListener('click', () => {
      this.onReply(comment)
    })
    footer.appendChild(reply)

    item.appendChild(footer)

    return item
  }

  /**
   * 格式化时间
   */
  private formatTime(timestamp: number): string {
    const now = Date.now()
    const diff = now - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} 天前`
    if (hours > 0) return `${hours} 小时前`
    if (minutes > 0) return `${minutes} 分钟前`
    return '刚刚'
  }

  /**
   * 回复评论
   */
  private onReply(comment: CommentItem): void {
    console.log('Reply to comment:', comment)
    // 触发回复事件
    const event = new CustomEvent('comment:reply', {
      detail: { comment }
    })
    window.dispatchEvent(event)
  }

  /**
   * 应用样式
   */
  private applyStyles(): void {
    if (!this.commentElement) return

    this.commentElement.style.marginTop = '40px'
    this.commentElement.style.paddingTop = '20px'
    this.commentElement.style.borderTop = '1px solid var(--theme-border)'
  }

  /**
   * 获取评论列表
   */
  public getComments(): CommentItem[] {
    return [...this.comments]
  }

  /**
   * 添加评论
   */
  public addComment(comment: CommentItem): void {
    this.comments.unshift(comment)
    this.sortComments()
    this.currentPage = 1
    this.renderComments()
  }

  /**
   * 删除评论
   */
  public removeComment(id: string): void {
    this.comments = this.comments.filter((c) => c.id !== id)
    this.renderComments()
  }

  /**
   * 获取评论数量
   */
  public getCommentCount(): number {
    return this.comments.length
  }
}
