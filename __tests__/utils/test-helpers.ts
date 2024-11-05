import { app } from '../../src/app';
import { agent } from 'supertest';
import { BASIC, convertToBase64 } from '../../src/common/middlewares/guards/authBase.guard';
import { BlogsViewDto } from '../../src/blogs/dto/blogsView.dto';
import { PostsViewDto } from '../../src/posts/dto/postsView.dto';
import { CommentViewDto } from '../../src/comments/dto/commentView.dto';
import { ObjectId } from 'mongodb';
import { BlogViewType } from '../../src/blogs/types/blog.types';
import { PostViewType } from '../../src/posts/types/post.types';
import { CommentViewType } from '../../src/comments/types/comment.types';

export const req = agent(app);

export const authorized = { 'Authorization': `${BASIC} ${convertToBase64()}` };

export const mokDataCreateBlog = {
  name: 'blog 1',
  description: 'blog 1',
  websiteUrl: 'https://EASajIWEY5VhOmcF.com',
};

export const mokBadDataCreateBlog = {
  name: '',
  description: '',
  websiteUrl: 'https://EASajIWEY5VhOmcF.eTRteOr_tm-QPIZzFSb95Jh5JYrUDBSU2RvpXgWadWQfhvMJxHwRQoZfuy-g.aEAHuT5QM7UaG7',
};

export const mokDataUpdateBlog = {
  name: 'blog 1 new',
  description: 'blog 1 new',
  websiteUrl: 'https://EASajIWEYOmcFnew.comn',
};

export const mokDataCreatePost = {
  title: 'post 1',
  shortDescription: 'post 1',
  content: 'post 1',
};

export const mokDataUpdatePost = {
  title: 'post 1 new',
  shortDescription: 'post 1 new',
  content: 'post 1 new',
};


class createEntity {
  blogs: BlogViewType[];
  posts: PostViewType[];
  comments: CommentViewType[];
  users: string;

  constructor() {
    this.blogs = [];
    this.posts = [];
    this.comments = [];
    this.users = '';
  }


  // async createBlog(data: any = null, i: number = 0) {
  //   const blog = {} as BlogViewType;
  //   blog._id = data._id ?? new ObjectId();
  //   blog.createdAt = data.createdAt && new Date().toISOString();
  //   blog.isMembership = data.isMembership && false;
  //
  //   if (data) {
  //     blog.name = data.name && 'blog';
  //     blog.description = data.description && 'blog description';
  //     blog.websiteUrl = data.websiteUrl && `https://websiteurl.com`;
  //     return blog;
  //   }
  //
  //   blog.name = data.name && 'blog ' + i;
  //   blog.description = data.description && 'blog description ' + i;
  //   blog.websiteUrl = data.websiteUrl && `https://websiteurl${i}.com`;
  //
  //   return blog;
  // }
  //
  // async createBlogs(data: any, count: number) {
  //   for (let i = 0; i <= count; i++) {
  //     this.blogs.push(await this.createBlog(null, i));
  //   }
  // }
}