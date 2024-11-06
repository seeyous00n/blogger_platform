import { UserViewDto } from '../dto/usersView.dto';

export type UsersViewModel = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: UserViewDto[]
}