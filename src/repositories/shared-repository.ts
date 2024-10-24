import { Collection } from 'mongodb';
import { PostType } from '../types/post-types';
import { BlogType } from '../types/blog-types';
import { filterType } from '../filters/query-string-filter';

class SharedRepository {
  async findData(collection: Collection<BlogType> | Collection<PostType>, filter: filterType) {
    return await collection
      .find(filter.search)
      .sort(filter.sort)
      .skip(filter.skip)
      .limit(filter.limit)
      .toArray();
  };
}

export const sharedRepository = new SharedRepository();