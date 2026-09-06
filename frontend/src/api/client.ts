import type { KnowledgeDoc } from "../types";
import { getAuthToken } from "./authToken";

export const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function url(path: string) {
  return `${API_BASE}${path}`;
}

async function authHeaders(
  extra: Record<string, string> = {},
): Promise<Record<string, string>> {
  const token = await getAuthToken();

  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function safeJson(res: Response) {
  const text = await res.text();

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

export async function ping(): Promise<boolean> {
  try {
    const res = await fetch(url("/knowledge"), {
      method: "GET",
    });

    return res.ok;
  } catch {
    return false;
  }
}

export async function sendChat(
  message: string,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch(url("/chat"), {
    method: "POST",
    headers: await authHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ message }),
    signal,
  });

  if (!res.ok) {
    const err = await safeJson(res);

    throw new Error(
      typeof err === "string"
        ? err
        : err?.detail || `Request failed (${res.status})`,
    );
  }

  const data = await safeJson(res);

  if (data && typeof data === "object" && "reply" in data) {
    return String((data as { reply: unknown }).reply ?? "");
  }

  return typeof data === "string" ? data : "";
}

/**
 * Streams a chat completion from POST /chat/stream.
 * Handles both raw text streams and SSE-style `data: ...` payloads.
 * Yields text tokens as they arrive.
 */
export async function* streamChat(
  message: string,
  signal?: AbortSignal,
): AsyncGenerator<string, void, void> {
  const res = await fetch(url("/chat/stream"), {
    method: "POST",
    headers: await authHeaders({
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    }),
    body: JSON.stringify({ message }),
    signal,
  });

  if (!res.ok || !res.body) {
    const err = await safeJson(res).catch(() => null);

    throw new Error(
      typeof err === "string"
        ? err
        : (err as { detail?: string })?.detail ||
            `Stream failed (${res.status})`,
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  const parseChunk = (chunk: string): string => {
    if (chunk.startsWith("data:")) {
      const payload = chunk.replace(/^data:\s?/, "").trim();

      if (!payload || payload === "[DONE]") {
        return "";
      }

      try {
        const parsed = JSON.parse(payload);

        if (typeof parsed === "string") return parsed;
        if (parsed?.content) return String(parsed.content);
        if (parsed?.delta) return String(parsed.delta);
        if (parsed?.text) return String(parsed.text);
        if (parsed?.token) return String(parsed.token);
        if (parsed?.reply) return String(parsed.reply);

        if (parsed?.choices?.[0]?.delta?.content) {
          return String(parsed.choices[0].delta.content);
        }

        return "";
      } catch {
        return payload;
      }
    }

    return chunk;
  };

  while (true) {
    const { value, done } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    if (buffer.includes("\n\n")) {
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        const lines = event.split("\n").filter(Boolean);

        for (const line of lines) {
          const out = parseChunk(line);

          if (out) {
            yield out;
          }
        }
      }
    } else if (!buffer.includes("data:")) {
      yield buffer;
      buffer = "";
    }
  }

  if (buffer) {
    const out = parseChunk(buffer);

    if (out) {
      yield out;
    }
  }
}

export async function uploadFile(
  file: File,
  onProgress?: (p: number) => void,
): Promise<unknown> {
  return await new Promise(async (resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", url("/upload"));

    const token = await getAuthToken();

    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          resolve(xhr.responseText);
        }
      } else {
        reject(
          new Error(xhr.responseText || `Upload failed (${xhr.status})`),
        );
      }
    };

    xhr.onerror = () => {
      reject(new Error("Upload network error"));
    };

    const fd = new FormData();
    fd.append("file", file);

    xhr.send(fd);
  });
}

export async function listKnowledge(): Promise<KnowledgeDoc[]> {
  const res = await fetch(url("/knowledge"), {
    headers: await authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to load knowledge (${res.status})`);
  }

  const data = await safeJson(res);

  if (Array.isArray(data)) {
    return data as KnowledgeDoc[];
  }

  if (data && typeof data === "object") {
    const anyData = data as Record<string, unknown>;

    if (Array.isArray(anyData.documents)) {
      return anyData.documents as KnowledgeDoc[];
    }

    if (Array.isArray(anyData.files)) {
      return anyData.files as KnowledgeDoc[];
    }

    if (Array.isArray(anyData.knowledge)) {
      return anyData.knowledge as KnowledgeDoc[];
    }
  }

  return [];
}

export async function deleteKnowledge(filename: string): Promise<void> {
  const res = await fetch(
    url(`/knowledge/${encodeURIComponent(filename)}`),
    {
      method: "DELETE",
      headers: await authHeaders(),
    },
  );

  if (!res.ok) {
    throw new Error(`Delete failed (${res.status})`);
  }
}

export async function getHistory(): Promise<unknown[]> {
  const res = await fetch(url("/history"), {
    headers: await authHeaders(),
  });

  if (!res.ok) {
    throw new Error(`History failed (${res.status})`);
  }

  const data = await safeJson(res);

  if (Array.isArray(data)) {
    return data;
  }

  return [];
}