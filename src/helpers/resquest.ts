interface IXdata<T> {
  status: number;
  statusText: string;
  type: ResponseType;
  url: string;
  headers: Headers;
  data: T;
}

export const invokeAPI = async <T>(
  url: string,
  options: RequestInit,
  output: "text" | "json" = "json",
): Promise<IXdata<T>> => {
  try {
    const endpoint = await fetch(url, options);
    let result: any;

    if (output === "text") {
      result = await endpoint.text();
    } else {
      result = await endpoint.json();
    }

    const response: IXdata<T> = {
      status: endpoint.status,
      statusText: endpoint.statusText,
      type: endpoint.type,
      url: endpoint.url,
      headers: endpoint.headers,
      data: result,
    };

    return response;
  } catch (error) {
    const err = error as Error;
    console.error(`Error invoking API: ${err.message}`);
    throw err;
  }
};
