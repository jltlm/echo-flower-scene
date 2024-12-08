# echo_flower_scene
a recreation of the echo flower scene using WebGPU

you will HAVE to run it on a server first

Notes:
- sampling all textures to conditionally choose which one to render for a vertex isn't efficient, but time crunch so I couldn't figure out a better way to go about it yet (in the shaders)
- speaking of the textures- to choose which one to use, only using >< would work. == would give a kind of both-textures mix (not good)

Credits:
Frisk Model: DAR88 on sketchfab: https://sketchfab.com/3d-models/frisk-undertale-f086373804734d1d8db0f83b35faa240

Wood Texture: https://pixabay.com/illustrations/wood-texture-dark-brown-1700562/