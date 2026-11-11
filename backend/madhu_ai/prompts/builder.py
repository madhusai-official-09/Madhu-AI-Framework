class PromptBuilder:
    @staticmethod
    def build(context: str, question: str):
        if context.strip():
            return (
                f"Context:\n{context}\n\nQuestion: {question}\n"
                "Answer concisely using the context. If it's missing, say so briefly."
            )
        return question