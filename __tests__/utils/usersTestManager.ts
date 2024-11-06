import { mokDataCreateBlog, req } from './test-helpers';
import { HTTP_STATUS_CODE, ROUTER_PATHS } from '../../src/common/settings';
import { UserCreateModel } from '../../src/users/models/userCreate.model';

export class usersTestManager {
  async createUser(data: UserCreateModel, httpStatusCode = HTTP_STATUS_CODE.CREATED_201) {

    const createdUser = await req
      .post(`${ROUTER_PATHS.AUTH}/registration`)
      .send(data)
      .expect(httpStatusCode);

    if (httpStatusCode === HTTP_STATUS_CODE.CREATED_201) {
      const createdEntity = createdUser.body;
      expect(createdEntity).toEqual({
        ...mokDataCreateBlog,
        id: createdEntity.id,
      });
    }

    return createdUser;
  }
}