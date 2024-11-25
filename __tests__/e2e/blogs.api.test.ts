import {
  req,
  authorized,
  createEntity,
  mokDataCreatePost
} from '../utils/test-helpers';
import { describe } from 'node:test';
import { HTTP_STATUS_CODE, ROUTER_PATHS } from '../../src/common/settings';
import { client, runDB } from '../../src/common/db/db';

describe('/blogs', async () => {
  beforeAll(async () => {
    await runDB();
  });

  beforeEach(async () => {
    await req.delete(ROUTER_PATHS.TESTING);
  });

  afterAll(async () => {
    await client.close();
  });

  it('should return [], status 200', async () => {
    const defaultData = {
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    }

    await req
      .get(ROUTER_PATHS.BLOGS)
      .expect(HTTP_STATUS_CODE.OK_200, defaultData);
  });

  it('should create post', async () => {
    await createEntity.createBlogs(3)
    const blogs = createEntity.blogs;

    await createEntity.createPosts(2)
    const posts = createEntity.posts;

    await req
      .post(ROUTER_PATHS.BLOGS + `/${blogs[0].id}/posts`)
      .set(authorized)
      .send(mokDataCreatePost)
      .expect(HTTP_STATUS_CODE.CREATED_201);


    const resultGetPostByBlog = await req
      .get(`${ROUTER_PATHS.BLOGS}/${blogs[0].id}/posts`)
      .expect(HTTP_STATUS_CODE.OK_200);

    expect(resultGetPostByBlog.body).toEqual(
      {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: expect.any(Array)
      },
    );

    await createEntity.createUserAndGetToken()
    await createEntity.createComments(createEntity.userToken)
    const comment = createEntity.comments;
  });
  //
  // it('shouldn`t create a blog (not authorized)', async () => {
  //   await req
  //     .post(ROUTER_PATHS.BLOGS)
  //     .send(mokDataCreateBlog)
  //     .expect(HTTP_STATUS_CODE.UNAUTHORIZED_401);
  // });
  //
  // it('should create a blog', async () => {
  //   const createdBlog = await blogsTestManager.createBlog(mokDataCreateBlog);
  //
  //   await req
  //     .get(`${ROUTER_PATHS.BLOGS}/${createdBlog.body.id}`)
  //     .expect(HTTP_STATUS_CODE.OK_200);
  // });
  //
  // it('should update a blog', async () => {
  //   const createdBlog = await blogsTestManager.createBlog(mokDataCreateBlog);
  //
  //   await req
  //     .get(`${ROUTER_PATHS.BLOGS}/${createdBlog.body.id}`)
  //     .expect(HTTP_STATUS_CODE.OK_200);
  //
  //   await req
  //     .put(`${ROUTER_PATHS.BLOGS}/${createdBlog.body.id}`)
  //     .set(authorized)
  //     .send(mokDataUpdateBlog)
  //     .expect(HTTP_STATUS_CODE.NO_CONTENT_204);
  //
  //   const getUpdateBlog = await req
  //     .get(`${ROUTER_PATHS.BLOGS}/${createdBlog.body.id}`)
  //     .expect(HTTP_STATUS_CODE.OK_200);
  //
  //   expect(getUpdateBlog.body).toEqual({
  //     ...mokDataUpdateBlog,
  //     id: getUpdateBlog.body.id,
  //   });
  // });
  //
  // it('shouldn`t delete a blog (not authorized)', async () => {
  //   const createdBlog = await blogsTestManager.createBlog(mokDataCreateBlog);
  //
  //   await req
  //     .delete(`${ROUTER_PATHS.BLOGS}/${createdBlog.body.id}`)
  //     .expect(HTTP_STATUS_CODE.UNAUTHORIZED_401);
  // });
  //
  // it('should delete a blog', async () => {
  //   const createdBlog = await blogsTestManager.createBlog(mokDataCreateBlog);
  //
  //   await req
  //     .delete(`${ROUTER_PATHS.BLOGS}/${createdBlog.body.id}`)
  //     .set(authorized)
  //     .expect(HTTP_STATUS_CODE.NO_CONTENT_204);
  // });
});