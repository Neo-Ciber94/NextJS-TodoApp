import { PageResult } from "@lib/repositories/base/repository";
import axios, { Axios, AxiosRequestConfig } from "axios";

export interface QueryOptions {
  page?: number;
  pageSize?: number;
}

export class RestApiClient<T, TKey> {
  public readonly client: Axios;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
    });
  }

  async getAll(
    options: QueryOptions = {},
    config: AxiosRequestConfig<T> = {}
  ): Promise<PageResult<T>> {
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;

    const result = await this.client.get<PageResult<T>>(`/`, {
      ...config,
      params: {
        page,
        pageSize,
      },
    });

    return result.data;
  }

  async getById(id: TKey, config: AxiosRequestConfig<T> = {}): Promise<T> {
    const result = await this.client.get(`/${id}`, config);
    return result.data;
  }

  async create(
    item: Partial<T>,
    config: AxiosRequestConfig<T> = {}
  ): Promise<T> {
    const result = await this.client.post(`/`, item, config);
    return result.data;
  }

  async update(
    id: TKey,
    item: Partial<T>,
    config: AxiosRequestConfig<T> = {}
  ): Promise<T> {
    const result = await this.client.put(`/${id}`, item, config);
    return result.data;
  }

  async partialUpdate(
    id: TKey,
    item: Partial<T>,
    config: AxiosRequestConfig<T> = {}
  ): Promise<T> {
    const result = await this.client.patch(`/${id}`, item, config);
    return result.data;
  }
}
