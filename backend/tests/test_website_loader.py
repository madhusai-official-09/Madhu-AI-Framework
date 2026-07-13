from madhu_ai.loaders.website_loader import WebsiteLoader

loader = WebsiteLoader()

text = loader.load("https://portfolio-rust-one-56mja0eudc.vercel.app/")

print(text)