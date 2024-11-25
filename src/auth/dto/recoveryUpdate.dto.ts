import { add } from "date-fns";
import { ObjectId } from "mongodb";
import { createUuid } from "../../common/utils/createUuid.util";

export class RecoveryUpdateDto {
  id: ObjectId;
  code: string;
  expirationDate: Date;

  constructor(model: { id: ObjectId }) {
    this.id = model.id;
    this.code = createUuid();
    this.expirationDate = add(new Date(), { hours: 1 });
  }
}