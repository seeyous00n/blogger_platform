import { app } from '../../src/app';
import { agent } from 'supertest';
import { BASIC, convertToBase64 } from '../../src/common/middlewares/guards/authBase.guard';
import { BlogsViewDto } from '../../src/blogs/dto/blogsView.dto';
import { PostsViewDto } from '../../src/posts/dto/postsView.dto';
import { CommentViewDto } from '../../src/comments/dto/commentView.dto';
import { ObjectId } from 'mongodb';
import { BlogViewType } from '../../src/blogs/types/blog.types';
import { PostViewType } from '../../src/posts/types/post.types';
import { CommentEntityType, CommentViewType } from '../../src/comments/types/comment.types';
import { HTTP_STATUS_CODE, ROUTER_PATHS } from "../../src/common/settings";
import { BlogCreateModel } from "../../src/blogs/models/blogCreate.model";
import { PostCreateModel } from "../../src/posts/models/postCreate.model";
import { CommentCreateInputModel } from "../../src/comments/models/CommentCreateInput.model";
import { UserCreateModel } from "../../src/users/models/userCreate.model";
import { nodemailerService } from "../../src/common/adapters/nodemailer.service";

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


class CreateEntity {
  blogs: BlogsViewDto[];
  posts: PostsViewDto[];
  comments: CommentViewDto[];
  userToken: string;

  constructor() {
    this.blogs = [];
    this.posts = [];
    this.comments = [];
    this.userToken = '';
  }
// const blog = {} as BlogViewType;
  // blog._id = data._id ?? new ObjectId();
  // blog.createdAt = data.createdAt && new Date().toISOString();
  // blog.isMembership = data.isMembership && false;
  //
  // if (data) {
  //   blog.name = data.name && 'blog';
  //   blog.description = data.description && 'blog description';
  //   blog.websiteUrl = data.websiteUrl && `https://websiteurl.com`;
  //   return blog;
  // }
  //
  // blog.name = data.name && 'blog ' + i;
  // blog.description = data.description && 'blog description ' + i;
  // blog.websiteUrl = data.websiteUrl && `https://websiteurl${i}.com`;


  async createBlog(i: number, data?: any) {
    const blog = {} as BlogCreateModel;
    if (data) {
      blog.name = data.name;
      blog.description = data.description;
      blog.websiteUrl = data.websiteUrl;
    } else {
      blog.name = `blog ${i}`;
      blog.description = `blog description ${i}`;
      blog.websiteUrl = `https://websiteurl${i}.com`;
    }

    return blog;
  }

  async createBlogs(count: number = 1, data?: any) {
    for (let i = 0; i < count; i++) {
      const createdBlog = await req
        .post(ROUTER_PATHS.BLOGS)
        .set(authorized)
        .send(await this.createBlog(i, data))
        .expect(HTTP_STATUS_CODE.CREATED_201);

      this.blogs.push(createdBlog.body);
    }
  }

  async createPost(i: number, data?: any) {
    const post = {} as PostCreateModel;
    if (data) {
      post.title = data.title;
      post.shortDescription = data.shortDescription;
      post.content = data.content;
      post.blogId = data.blogId;
    } else {
      post.title = `post ${i}`;
      post.shortDescription = `post shortDescription ${i}`;
      post.content = `post content ${i}`;
      post.blogId = this.blogs[i].id.toString();
    }

    return post;
  }

  async createPosts(count: number = 1, data?: any) {
    for (let i = 0; i < count; i++) {
      const createdPost = await req
        .post(ROUTER_PATHS.POSTS)
        .set(authorized)
        .send(await this.createPost(i, data))
        .expect(HTTP_STATUS_CODE.CREATED_201);

      this.posts.push(createdPost.body);
    }
  }

  async createComment(i: number, data?: any) {
    const comment = {} as { content: string }
    if (data) {
      comment.content = data.content;
    } else {
      comment.content = `stringstringstringst ${i}`
    }

    return comment;
  }

  async createComments(token: string, count: number = 1, data?: any) {
    for (let i = 0; i < count; i++) {
      const comment = await this.createComment(i, data)
      const createdComment = await req
        .post(ROUTER_PATHS.POSTS + `/${this.posts[0].id}/comments`)
        .set({ 'Authorization': `Bearer ${token}` })
        .send(comment)
        .expect(HTTP_STATUS_CODE.CREATED_201);

      this.comments.push(createdComment.body);
    }
  }


  async createUserAndGetToken() {
    const data: UserCreateModel = { login: 'login11', password: 'login11111', email: 'borovikov.live@gmail.com' };
    nodemailerService.sendEmail = jest.fn().mockImplementationOnce((): Promise<void> => Promise.resolve());

    await req
      .post(`${ROUTER_PATHS.AUTH}/registration`)
      .send(data)
      .expect(HTTP_STATUS_CODE.NO_CONTENT_204);

    const loginUser = await req
      .post(`${ROUTER_PATHS.AUTH}/login`)
      .send({
        "loginOrEmail": data.login,
        "password": data.password
      })
      .expect(HTTP_STATUS_CODE.OK_200)

    this.userToken = loginUser.body.accessToken;
  }
}

export const createEntity = new CreateEntity();