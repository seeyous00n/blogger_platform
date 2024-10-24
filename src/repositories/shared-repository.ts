import { Collection } from 'mongodb';

class SharedRepository {
  async findData(collection: Collection<any>, filter: any) {
    return await collection
      .find(filter.search)
      .sort(filter.sort as {})
      .skip(filter.skip)
      .limit(filter.limit)
      .toArray();
  };
}

export const sharedRepository = new SharedRepository();