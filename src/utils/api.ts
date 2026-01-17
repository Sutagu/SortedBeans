export async function apiRequest<T>(
  url: string,
  options: RequestInit
): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || res.statusText);
  }
  if (res.status === 204) {
    console.log('returning no response');
    return {} as T;
  }
  console.log('returning full data');
  const data = await res.json();
  return data;
}
