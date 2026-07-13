export interface ClientOptions {
  apiUrl: string;
}

export class MadhuAIClient {
  private apiUrl: string;

  constructor(options: ClientOptions) {
    this.apiUrl = options.apiUrl;
  }

  async chat(message: string) {
    const response = await fetch(`${this.apiUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("MadhuAI Server Error");
    }

    return await response.json();
  }

  async stream(message: string, onToken: (token: string) => void) {
    const response = await fetch(`${this.apiUrl}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("MadhuAI Server Error");
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);

      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        const data = line.replace("data: ", "");

        if (data === "[DONE]") return;

        try {
          const json = JSON.parse(data);
          onToken(json.token);
        } catch {}
      }
    }
  }

  async upload(file: File) {
    const form = new FormData();

    form.append("file", file);

    const response = await fetch(
      `${this.apiUrl}/upload`,
      {
        method: "POST",
        body: form,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return response.json();
  }

  async knowledge() {
    const response = await fetch(
      `${this.apiUrl}/knowledge`
    );

    return response.json();
  }

  async deleteKnowledge(name: string) {
    await fetch(
      `${this.apiUrl}/knowledge/${name}`,
      {
        method: "DELETE",
      }
    );
  }
}
