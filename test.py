import json
from PIL import Image, ImageStat
import os
p = 'public/images'
results = {}
for f in os.listdir(p):
    if f.startswith('WhatsApp'):
        try:
            img = Image.open(os.path.join(p,f))
            stat = ImageStat.Stat(img.convert('L'))
            results[f] = {"size": img.size, "brightness": round(stat.mean[0], 2)}
        except Exception as e:
            results[f] = str(e)
with open('test.json', 'w') as f:
    json.dump(results, f, indent=2)
