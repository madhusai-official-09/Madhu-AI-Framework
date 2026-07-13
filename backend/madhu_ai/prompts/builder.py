class PromptBuilder:

    @staticmethod
    def build(context: str, question: str):

        if context.strip():

            return f"""
You are MadhuAI, a helpful AI assistant.

Use the context below to answer the question.

If the context is relevant, prefer using it.
If the context is incomplete, you may use your own knowledge to give a helpful answer.

Context:
{context}

Question:
{question}

Answer:
"""

        return f"""
You are MadhuAI, a helpful AI assistant.

The user did not provide any relevant context.

Answer the question normally using your own knowledge.

Question:
{question}

Answer:
"""