from ..providers.groq_provider import GroqProvider

class ProviderFactory:

    @staticmethod
    def create(config):

        providers = {
            "groq": GroqProvider
        }

        provider = providers.get(config.provider)

        if provider is None:
            raise ValueError(
                f"Unknown provider: {config.provider}"
            )

        
        return provider(config)