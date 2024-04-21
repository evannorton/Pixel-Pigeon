export interface MakeHTTPRequestOptions {
  url: string;
}
export const makeHTTPRequest = async (
  options: MakeHTTPRequestOptions,
): Promise<Response> => {
  const res: Response = await fetch(options.url);
  return res;
};
