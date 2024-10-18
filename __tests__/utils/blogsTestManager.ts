import { authorized, mokDataCreateBlog, req } from './test-helpers';
import { HTTP_STATUS_CODE, ROUTER_PATHS } from '../../src/settings';
import { BlogCreateModel } from '../../src/models/blog/BlogCreateModel';

export const blogsTestManager = {
  async createBlog(data: BlogCreateModel, httpStatusCode = HTTP_STATUS_CODE.CREATED_201) {
    const createdBlog = await req
      .post(ROUTER_PATHS.BLOGS)
      .set(authorized)
      .send(data)
      .expect(httpStatusCode);

    if (httpStatusCode === HTTP_STATUS_CODE.CREATED_201) {
      const createdEntity = createdBlog.body;
      expect(createdEntity).toEqual({
        ...mokDataCreateBlog,
        id: createdEntity.id,
      });
    }

    return createdBlog;
  },
};