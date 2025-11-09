export async function apiRequest<T>(
  url: string,
  options: RequestInit
): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || res.statusText);
  }
  return res.json();
}
