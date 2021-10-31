import duolingo
import os
from dotenv import load_dotenv
import json

load_dotenv()

lingo = duolingo.Duolingo(os.environ['DUOLINGO_USERNAME'], os.environ['DUOLINGO_PASSWORD'])

vocabulary = lingo.get_vocabulary(language_abbr='zs')

print(json.dumps(vocabulary, ensure_ascii=False))