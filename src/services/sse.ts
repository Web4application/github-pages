export async function* ssePost(url: string, body: any, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  if (!res.body) throw new Error("No body in response");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf("\n\n")) !== -1) {
      const chunk = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 2);
      if (chunk.startsWith("data:")) {
        const json = chunk.slice(5).trim();
        if (json) yield JSON.parse(json);
      }
    }
  }
}
