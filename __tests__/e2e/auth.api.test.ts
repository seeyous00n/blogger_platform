import { req } from '../utils/test-helpers';
import { describe } from 'node:test';
import { HTTP_STATUS_CODE, ROUTER_PATHS } from '../../src/common/settings';
import { client, runDB } from '../../src/db';
import { UserCreateModel } from '../../src/users/models/userCreate.model';
import { nodemailerService } from '../../src/common/adapters/nodemailer.service';

describe('/auth', async () => {
  beforeAll(async () => {
    await runDB();
  });

  beforeEach(async () => {
    await req.delete(ROUTER_PATHS.TESTING);
  });

  afterAll(async () => {
    await client.close();
  });

  it('/registration, /login', async () => {
    const data: UserCreateModel = { login: 'login11', password: 'login11111', email: 'borovikov.live@gmail.com' };
    nodemailerService.sendEmail = jest.fn().mockImplementationOnce((): Promise<void> => Promise.resolve());

    await req
      .post(`${ROUTER_PATHS.AUTH}/registration`)
      .send(data)
      .expect(HTTP_STATUS_CODE.NO_CONTENT_204);

    const user = await req
      .get(`${ROUTER_PATHS.USERS}/`)
      .expect(HTTP_STATUS_CODE.OK_200);

    expect(user.body.items).toEqual([
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
  });
});
