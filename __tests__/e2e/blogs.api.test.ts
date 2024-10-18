import { req, mokDataCreateBlog, authorized, mokDataUpdateBlog, mokDataCreatePost } from '../utils/test-helpers';
import { describe } from 'node:test';
import { HTTP_STATUS_CODE, ROUTER_PATHS } from '../../src/settings';
import { blogsTestManager } from '../utils/blogsTestManager';

describe('/blogs', () => {
  // beforeAll(async () => {
  //   await req.delete(ROUTER_PATHS.TESTING);
  // });

  beforeEach(async () => {
    await req.delete(ROUTER_PATHS.TESTING);
  });

  it('should return [], status 200', async () => {
    await req
      .get(ROUTER_PATHS.BLOGS)
      .expect(HTTP_STATUS_CODE.OK_200, []);
  });

  it('shouldn`t create a blog (not authorized)', async () => {
    await req
      .post(ROUTER_PATHS.BLOGS)
      .send(mokDataCreateBlog)
      .expect(HTTP_STATUS_CODE.UNAUTHORIZED_401);
  });

  it('should create a blog', async () => {
    const createdBlog = await blogsTestManager.createBlog(mokDataCreateBlog);

    await req
      .get(`${ROUTER_PATHS.BLOGS}/${createdBlog.body.id}`)
      .expect(HTTP_STATUS_CODE.OK_200);
  });

  it('should update a blog', async () => {
    const createdBlog = await blogsTestManager.createBlog(mokDataCreateBlog);

    await req
      .get(`${ROUTER_PATHS.BLOGS}/${createdBlog.body.id}`)
      .expect(HTTP_STATUS_CODE.OK_200);

    await req
      .put(`${ROUTER_PATHS.BLOGS}/${createdBlog.body.id}`)
      .set(authorized)
      .send(mokDataUpdateBlog)
      .expect(HTTP_STATUS_CODE.NO_CONTENT_204);

    const getUpdateBlog = await req
      .get(`${ROUTER_PATHS.BLOGS}/${createdBlog.body.id}`)
      .expect(HTTP_STATUS_CODE.OK_200);

    expect(getUpdateBlog.body).toEqual({
      ...mokDataUpdateBlog,
      id: getUpdateBlog.body.id,
    });
  });

  it('shouldn`t delete a blog (not authorized)', async () => {
    const createdBlog = await blogsTestManager.createBlog(mokDataCreateBlog);

    await req
      .delete(`${ROUTER_PATHS.BLOGS}/${createdBlog.body.id}`)
      .expect(HTTP_STATUS_CODE.UNAUTHORIZED_401);
  });

  it('should delete a blog', async () => {
    const createdBlog = await blogsTestManager.createBlog(mokDataCreateBlog);

    await req
      .delete(`${ROUTER_PATHS.BLOGS}/${createdBlog.body.id}`)
      .set(authorized)
      .expect(HTTP_STATUS_CODE.NO_CONTENT_204);
  });
});