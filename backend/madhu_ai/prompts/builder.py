
class PromptBuilder:
    @staticmethod
    def build(context: str, question: str):
        if context.strip():
            return (
                f"Relevant Knowledge:\n{context}\n\n"
                f"User Question: {question}\n\n"
                "Instructions:\n"
                "- Answer the user's question directly.\n"
                "- Use the relevant knowledge provided above.\n"
                "- Summarize information in your own words.\n"
                "- Do not copy the entire context.\n"
                "- Keep the response short and conversational.\n"
                "- For simple questions, answer in 1-3 sentences.\n"
                "- Provide more detail only if requested.\n"
                "- If the context does not contain the answer, "
                "briefly state that the information is unavailable."
            )

        return question
