// @ts-ignore

import { req, mokDataCreateBlog, authorized, mokDataCreatePost, mokDataUpdatePost } from '../utils/test-helpers';
import { describe } from 'node:test';
import { HTTP_STATUS_CODE, ROUTER_PATHS } from '../../src/common/settings';
import { blogsTestManager } from '../utils/blogsTestManager';

describe('/posts', () => {
  beforeEach(async () => {
    await req.delete(ROUTER_PATHS.TESTING);
  });

  it('shouldn`t create a post (not authorized)', async () => {
    await req
      .post(ROUTER_PATHS.POSTS)
      .send(mokDataCreatePost)
      .expect(HTTP_STATUS_CODE.UNAUTHORIZED_401);

    await req
      .get(ROUTER_PATHS.POSTS)
      .expect(HTTP_STATUS_CODE.OK_200, []);
  });

  it('should create a post', async () => {
    const createdBlog = await blogsTestManager.createBlog(mokDataCreateBlog);
    const mokDataCreatePostWithID = {
      ...mokDataCreatePost,
      blogId: createdBlog.body.id,
    };

    const createdPost = await req
      .post(ROUTER_PATHS.POSTS)
      .set(authorized)
      .send(mokDataCreatePostWithID)
      .expect(HTTP_STATUS_CODE.CREATED_201);

    const getPost = await req
      .get(`${ROUTER_PATHS.POSTS}/${createdPost.body.id}`)
      .expect(HTTP_STATUS_CODE.OK_200);

    expect(getPost.body).toEqual({
      ...mokDataCreatePostWithID,
      id: expect.any(String),
      blogName: createdBlog.body.name,
    });
  });

  it('should delete a post', async () => {
    const createdBlog = await blogsTestManager.createBlog(mokDataCreateBlog);
    const mokDataCreatePostWithID = {
      ...mokDataCreatePost,
      blogId: createdBlog.body.id,
    };

    const createdPost = await req
      .post(ROUTER_PATHS.POSTS)
      .set(authorized)
      .send(mokDataCreatePostWithID)
      .expect(HTTP_STATUS_CODE.CREATED_201);

    const getPost = await req
      .get(`${ROUTER_PATHS.POSTS}/${createdPost.body.id}`)
      .expect(HTTP_STATUS_CODE.OK_200);

    await req
      .delete(`${ROUTER_PATHS.POSTS}/${getPost.body.id}`)
      .set(authorized)
      .expect(HTTP_STATUS_CODE.NO_CONTENT_204);

    await req
      .get(`${ROUTER_PATHS.POSTS}`)
      .expect(HTTP_STATUS_CODE.OK_200, []);
  });

  it('should update a post', async () => {
    const createdBlog = await blogsTestManager.createBlog(mokDataCreateBlog);
    const mokDataCreatePostWithID = {
      ...mokDataCreatePost,
      blogId: createdBlog.body.id,
    };

    const createdPost = await req
      .post(ROUTER_PATHS.POSTS)
      .set(authorized)
      .send(mokDataCreatePostWithID)
      .expect(HTTP_STATUS_CODE.CREATED_201);

    const getPost = await req
      .get(`${ROUTER_PATHS.POSTS}/${createdPost.body.id}`)
      .expect(HTTP_STATUS_CODE.OK_200);

    const mokDataUpdatePostWithID = {
      ...mokDataUpdatePost,
      blogId: createdBlog.body.id,
    };

    await req
      .put(`${ROUTER_PATHS.POSTS}/${getPost.body.id}`)
      .set(authorized)
      .send(mokDataUpdatePostWithID)
      .expect(HTTP_STATUS_CODE.NO_CONTENT_204);
  });
});
