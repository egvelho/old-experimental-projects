import { AxiosResponse } from "axios";
import { client, validatedClient, ClientConfig, MaybeOutput } from "./client";

const baseURL =
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ??
  process.env.REACT_APP_FIREBASE_DATABASE_URL ??
  process.env.FIREBASE_DATABASE_URL;

export interface RouteEntry {
  readonly name: string;
  readonly nested: RouteList | null;
}
export interface RouteList {
  readonly [key: string]: RouteEntry;
}

type Get<T> = (
  params: Query<T>,
  config: ClientConfig
) => Promise<AxiosResponse<T | undefined>>;

type OrderBy<T> = {
  orderBy: keyof T | keyof T[keyof T] | "$key" | "$value" | "$priority";
};

type Limit<T> = { limitToFirst: number; limitToLast: number };

type Paginate<T> = { startAt: string; endAt: string };

type EqualTo<T> = { equalTo: string | number | boolean };

type OrderByChild<T> = {
  orderByChild: keyof T;
};

type OrderByValue<T> = {
  orderByValue: true;
};

type OrderByKey<T> = {
  orderByKey: true;
};

type Query<T> =
  | (OrderBy<T> &
      (
        | Limit<T>
        | Paginate<T>
        | EqualTo<T>
        | (Limit<T> & Paginate<T>)
        | (Limit<T> & EqualTo<T>)
        | {}
      ))
  | OrderByChild<T>
  | OrderByValue<T>
  | OrderByKey<T>
  | {};

type QueryGet<T> = () => ReturnType<Get<T>>;

interface QueryBuilder<Input, Output> {
  orderBy: (
    orderBy: OrderBy<Input>["orderBy"]
  ) => {
    startAt: (
      startAt: Paginate<Input>["startAt"]
    ) => {
      limitToFirst: (
        limitToFirst: Limit<Input>["limitToFirst"]
      ) => {
        get: QueryGet<Output>;
      };
      limitToLast: (
        limitToLast: Limit<Input>["limitToLast"]
      ) => {
        get: QueryGet<Output>;
      };
      endAt: (
        endAt: Paginate<Input>["endAt"]
      ) => {
        limitToFirst: (
          limitToFirst: Limit<Input>["limitToFirst"]
        ) => {
          get: QueryGet<Output>;
        };
        limitToLast: (
          limitToLast: Limit<Input>["limitToLast"]
        ) => {
          get: QueryGet<Output>;
        };
        get: QueryGet<Output>;
      };
      get: QueryGet<Output>;
    };
    endAt: (
      endAt: Paginate<Input>["endAt"]
    ) => {
      limitToFirst: (
        limitToFirst: Limit<Input>["limitToFirst"]
      ) => {
        get: QueryGet<Output>;
      };
      limitToLast: (
        limitToLast: Limit<Input>["limitToLast"]
      ) => {
        get: QueryGet<Output>;
      };
      get: QueryGet<Output>;
    };
    limitToFirst: (
      limitToFirst: Limit<Input>["limitToFirst"]
    ) => {
      get: QueryGet<Output>;
    };
    limitToLast: (
      limitToLast: Limit<Input>["limitToLast"]
    ) => {
      get: QueryGet<Output>;
    };
    equalTo: (
      equalTo: EqualTo<Input>["equalTo"]
    ) => {
      limitToFirst: (
        limitToFirst: Limit<Input>["limitToFirst"]
      ) => {
        limitToLast: (
          limitToLast: Limit<Input>["limitToLast"]
        ) => {
          get: QueryGet<Output>;
        };
        get: QueryGet<Output>;
      };
      limitToLast: (
        limitToLast: Limit<Input>["limitToLast"]
      ) => {
        get: QueryGet<Output>;
      };
      get: QueryGet<Output>;
    };
    get: QueryGet<Output>;
  };
  orderByChild: (
    orderByChild: OrderByChild<Input>["orderByChild"]
  ) => {
    get: QueryGet<Output>;
  };
  orderByValue: () => {
    get: QueryGet<Output>;
  };
  orderByKey: () => {
    get: QueryGet<Output>;
  };
}

function get<T>(url: string): Get<T> {
  return async (params, config) => {
    const response: AxiosResponse<any> = await client(
      Object.keys(params as Object).reduce(
        (obj, key) => ({
          ...obj,
          [key]:
            typeof (params as any)[key] === "string"
              ? `"${(params as any)[key]}"`
              : (params as any)[key],
        }),
        {}
      ),
      {
        method: "GET",
        url,
        baseURL,
        ...config,
      }
    );
    response.data =
      response.data !== null && response.data.error === undefined
        ? response.data
        : undefined;
    return response as AxiosResponse<T | undefined>;
  };
}

function queryGet<T>(
  response: AxiosResponse<T | undefined>
): AxiosResponse<T | undefined> {
  if (response.data !== undefined) {
    response.data = Object.values(response.data).filter((data) => data) as any;
    return response;
  } else {
    return response;
  }
}

function query<T>(
  genericGet: Get<T[keyof T][]>
): (config: ClientConfig) => QueryBuilder<T, T[keyof T][]> {
  const get: Get<T[keyof T][]> = async (...args: Parameters<Get<T>>) => {
    const response = await genericGet(...args);
    return queryGet(response);
  };

  return (config = {}) => ({
    orderBy: (orderBy: OrderBy<T>["orderBy"]) => ({
      startAt: (startAt: Paginate<T>["startAt"]) => ({
        limitToFirst: (limitToFirst: Limit<T>["limitToFirst"]) => ({
          get: () => get({ orderBy, startAt, limitToFirst }, config),
        }),
        limitToLast: (limitToLast: Limit<T>["limitToLast"]) => ({
          get: () => get({ orderBy, startAt, limitToLast }, config),
        }),
        endAt: (endAt: Paginate<T>["endAt"]) => ({
          limitToFirst: (limitToFirst: Limit<T>["limitToFirst"]) => ({
            get: () => get({ orderBy, startAt, endAt, limitToFirst }, config),
          }),
          limitToLast: (limitToLast: Limit<T>["limitToLast"]) => ({
            get: () => get({ orderBy, startAt, endAt, limitToLast }, config),
          }),
          get: () => get({ orderBy, startAt, endAt }, config),
        }),
        get: () => get({ orderBy, startAt }, config),
      }),
      endAt: (endAt: Paginate<T>["endAt"]) => ({
        limitToFirst: (limitToFirst: Limit<T>["limitToFirst"]) => ({
          get: () => get({ orderBy, endAt, limitToFirst }, config),
        }),
        limitToLast: (limitToLast: Limit<T>["limitToLast"]) => ({
          get: () => get({ orderBy, endAt, limitToLast }, config),
        }),
        get: () => get({ orderBy, endAt }, config),
      }),
      limitToFirst: (limitToFirst: Limit<T>["limitToFirst"]) => ({
        get: () => get({ orderBy, limitToFirst }, config),
      }),
      limitToLast: (limitToLast: Limit<T>["limitToLast"]) => ({
        get: () => get({ orderBy, limitToLast }, config),
      }),
      equalTo: (equalTo: EqualTo<T>["equalTo"]) => ({
        limitToFirst: (limitToFirst: Limit<T>["limitToFirst"]) => ({
          get: () => get({ orderBy, limitToFirst, equalTo }, config),
          limitToLast: (limitToLast: Limit<T>["limitToLast"]) => ({
            get: () => get({ orderBy, limitToLast, equalTo }, config),
          }),
        }),
        limitToLast: (limitToLast: Limit<T>["limitToLast"]) => ({
          get: () => get({ orderBy, limitToLast, equalTo }, config),
        }),
        get: () => get({ orderBy, equalTo }, config),
      }),
      get: () => get({ orderBy }, config),
    }),
    orderByChild: (key: OrderByChild<T>["orderByChild"]) => {
      return {
        get: () => get({ orderByChild: key }, config),
      };
    },
    orderByValue: () => {
      return {
        get: () => get({ orderByValue: true }, config),
      };
    },
    orderByKey: () => {
      return {
        get: () => get({ orderByKey: true }, config),
      };
    },
  });
}

export function request<T extends Object>(
  object: T,
  key: keyof T,
  arg: string = key as string,
  keys: (keyof T)[] = [key]
) {
  const obj = object[key];
  return {
    path() {
      return keys;
    },
    url() {
      return `/${keys.join("/")}.json`;
    },
    prop(key: keyof typeof obj, arg_: string = key as string) {
      return request(obj, key, arg_, [...(keys as any), arg_]);
    },
    query(config: ClientConfig = {}) {
      return query<typeof obj>(get(this.url()))(config);
    },
    get(params: Query<T> = {}, config: ClientConfig = {}) {
      return get<typeof obj>(this.url())(params, config);
    },
    async post(
      input: typeof obj,
      config: ClientConfig = {}
    ): Promise<AxiosResponse<MaybeOutput<string>>> {
      const response = await validatedClient<typeof input, any>(
        input,
        object as any,
        {
          method: "POST",
          url: this.url(),
          baseURL,
          ...config,
        }
      );

      response.data = {
        output: response.data?.name,
        errors: response.data?.errors ?? [],
      };
      return response;
    },
    async put(
      input: typeof obj,
      config: ClientConfig = {}
    ): Promise<AxiosResponse<MaybeOutput<typeof input>>> {
      const response = await validatedClient<typeof input, any>(
        input,
        object as any,
        {
          method: "PUT",
          url: this.url(),
          baseURL,
          ...config,
        }
      );

      response.data = {
        output:
          response.data && !response.data.error && !response.data.errors?.length
            ? response.data
            : undefined,
        errors: response.data?.errors ?? [],
      };

      return response;
    },
    async patch(
      input: Partial<typeof obj>,
      config: ClientConfig = {}
    ): Promise<AxiosResponse<MaybeOutput<typeof input>>> {
      const response = await validatedClient<typeof input, any>(
        input,
        object as any,
        {
          method: "PATCH",
          url: this.url(),
          baseURL,
          ...config,
        }
      );

      response.data = {
        output:
          response.data && !response.data.error && !response.data.errors?.length
            ? response.data
            : undefined,
        errors: response.data?.errors ?? [],
      };

      return response;
    },
    async delete(config: ClientConfig = {}): Promise<AxiosResponse<boolean>> {
      const response = await client<unknown, any>(
        {},
        { method: "DELETE", url: this.url(), baseURL, ...config }
      );

      response.data = response.data === null;
      return response;
    },
  };
}
