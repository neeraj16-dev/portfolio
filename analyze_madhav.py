import urllib.request
import re

c_url = "https://madhav.pro/_next/static/chunks/f4e892fef0ba11a6.js"
req = urllib.request.Request(c_url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    data = urllib.request.urlopen(req).read().decode("utf-8", errors="ignore")
    print("Length:", len(data))
    
    # Check for 3D components
    for term in ["Canvas", "useFrame", "useThree", "GLTFLoader", "TextureLoader", "OrbitControls", "displacementMap", "normalMap"]:
        print(f"{term}: {term in data}")
        
    # Find any GLTF/GLB models or special image textures
    models = re.findall(r'/[a-zA-Z0-9_\-\./]+\.(?:glb|gltf|bin)', data)
    print("Models:", set(models))
    
    # Find image paths
    images = re.findall(r'/[a-zA-Z0-9_\-\./]+\.(?:png|jpg|webp)', data)
    print("Sample images:", list(set(images))[:10])
except Exception as e:
    print("Error:", e)
