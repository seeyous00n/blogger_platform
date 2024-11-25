import { authorized, req } from '../utils/test-helpers';
import { describe } from 'node:test';
import { HTTP_STATUS_CODE, ROUTER_PATHS } from '../../src/common/settings';
import { client, runDB } from '../../src/common/db/db';
import { UserCreateModel } from '../../src/users/models/userCreate.model';
import { nodemailerService } from '../../src/common/adapters/nodemailer.service';

const data: UserCreateModel = { login: 'login11', password: 'login11111', email: 'borovikov.live@gmail.com' };

describe('/auth', async () => {
  beforeAll(async () => {
    await runDB();

    nodemailerService.sendEmail = jest.fn().mockImplementationOnce((): Promise<void> => Promise.resolve());
  });

  beforeEach(async () => {
    await req.delete(ROUTER_PATHS.TESTING);
  });

  afterAll(async () => {
    await client.close();
  });

  it('/registration, /login, /me, /delete (user)', async () => {
    const user =  await req
      .post(`${ROUTER_PATHS.AUTH}/registration`)
      .send(data)
      .expect(HTTP_STATUS_CODE.NO_CONTENT_204);

    const users = await req
      .set(authorized)
      .get(`${ROUTER_PATHS.USERS}/`)
      .expect(HTTP_STATUS_CODE.OK_200);

    const userItem = users.body.items[0];

    expect(users.body.items).toEqual([
      {
        id: expect.any(String),
        login: data.login,
        email: data.email,
        createdAt: expect.any(String),
      },
    ]);

    const loginUser = await req
      .post(`${ROUTER_PATHS.AUTH}/login`)
      .send({
        "loginOrEmail": data.login,
        "password": data.password
      })
      .expect(HTTP_STATUS_CODE.OK_200)

    expect(loginUser.body).toEqual({
      "accessToken": loginUser.body.accessToken,
    })

    await req
      .get(`${ROUTER_PATHS.AUTH}/me`)
      .set({ 'Authorization': `Bearer ${loginUser.body.accessToken}` })
      .expect(HTTP_STATUS_CODE.OK_200, {
        "email": userItem.email,
        "login": userItem.login,
        "userId": userItem.id
      });

    await req
      .delete(`${ROUTER_PATHS.USERS}/${userItem.id}`)
      .set(authorized)
      .expect(HTTP_STATUS_CODE.NO_CONTENT_204)

    await req
      .get(`${ROUTER_PATHS.USERS}/`)
      .set(authorized)
      .expect(HTTP_STATUS_CODE.OK_200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      })
  });
});
