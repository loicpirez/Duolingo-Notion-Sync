import duolingo
import os
from dotenv import load_dotenv
import json

load_dotenv()

lingo  = duolingo.Duolingo(os.environ['DUOLINGO_USERNAME'], os.environ['DUOLINGO_PASSWORD'])
known_words = lingo.get_known_words('zs')
print(json.dumps(known_words, ensure_ascii=False))