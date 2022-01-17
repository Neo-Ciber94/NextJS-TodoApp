import { IRepository, PageResult, PaginationOptions } from "./repository";
import { Model, FilterQuery } from "mongoose";
import { EntityInput, IEntity } from "@server/types";
import { createPagination, NO_FOUND_ERROR_MESSAGE } from "../utils";
import { ValidationError } from "yup";

/**
 * A base repository with the basic operations.
 */
export class Repository<T extends IEntity, TModel extends Model<T>>
  implements IRepository<T>
{
  constructor(protected readonly model: TModel) {}

  // prettier-ignore
  findWithPagination(options: PaginationOptions<T> = {}): Promise<PageResult<T>> {
    return createPagination(this.model, options);
  }

  async find(query: FilterQuery<T> = {}): Promise<T[]> {
    return await this.model.find(query);
  }

  async findOne(query: FilterQuery<T> = {}): Promise<T | null> {
    const result = await this.model.findOne(query);
    return result;
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.model.findById(id);
    return result;
  }

  async create(entity: EntityInput<T>): Promise<T> {
    return await this.model.create(entity);
  }

  async createMany(entities: EntityInput<T>[]): Promise<T[]> {
    const result = await this.model.create(entities);
    return result;
  }

  async updateOne(query: FilterQuery<T>, entity: EntityInput<T>): Promise<T> {
    this.setId(query, query.id);
    const entityToUpdate = await this.model.findOne(query);

    if (!entityToUpdate) {
      throw new ValidationError(NO_FOUND_ERROR_MESSAGE);
    }

    for (const key in entity) {
      const value = entity[key as keyof Omit<Partial<T>, "id">];

      if (value !== undefined) {
        (entityToUpdate as any)[key] = value;
      }
    }

    await entityToUpdate.save();
    return entityToUpdate;
  }

  async deleteOne(query: FilterQuery<T>): Promise<T> {
    this.setId(query, query.id);
    const entityToDelete = await this.model.findOne(query);

    if (!entityToDelete) {
      throw new ValidationError(NO_FOUND_ERROR_MESSAGE);
    }

    await entityToDelete.remove();
    return entityToDelete;
  }

  private setId(target: any, id?: unknown): void {
    if (id) {
      target._id = id;
      delete target.id;
    }
  }
}
