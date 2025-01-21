# echo_flower_scene
a recreation of the echo flower scene using WebGPU

you will HAVE to run it on a server first


Notes:
- sampling all textures to conditionally choose which one to render for a vertex isn't efficient, but time crunch so I couldn't figure out a better way to go about it yet (in the shaders)
- speaking of the textures- to choose which one to use, only using >< would work. == would give a kind of both-textures mix (not good)

Credits:
Frisk Model: DAR88 on sketchfab: https://sketchfab.com/3d-models/frisk-undertale-f086373804734d1d8db0f83b35faa240

Wood Texture: https://pixabay.com/illustrations/wood-texture-dark-brown-1700562/

## Here're some pics:
![Screenshot 2024-12-12 122636](https://github.com/user-attachments/assets/22ab9eac-212e-4209-a001-30e323cefc0d)
Birds-eye view - map was generated using Perlin noise

![Screenshot 2024-12-12 135710](https://github.com/user-attachments/assets/1bcc720f-d023-4fba-84df-d49b42dcedea)
Perspective View

![Screenshot 2024-12-12 115843](https://github.com/user-attachments/assets/8b1328b1-2e19-4a90-bd0d-43b3883b3656)
Frisk
