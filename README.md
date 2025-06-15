# Internal Project: Interactive Environment Upload

This repository is an internal project for the development and testing of interactive 3D environments.

## Purpose

The goal of this project is to provide a sandbox for viewing and testing 3D models (.glb/.gltf) with custom HDR/EXR lightmaps, without relying on fixed files or the `/public` folder.

## How it works

- **File Upload:**
  - When starting the project, the user is presented with an upload screen.
  - Two files must be uploaded:
    - A 3D model in `.glb` or `.gltf` format.
    - A lightmap file in `.hdr` or `.exr` format (HDRI image for lighting and environment).
- **Visualization:**
  - After upload, the 3D model is loaded into the interactive environment.
  - The HDR/EXR lightmap is applied as the global environment and lighting.
  - No files from the `/public` folder are used for the model or lightmap: everything is loaded from the user's upload.
- **Navigation:**
  - The user can navigate the environment in first person (FPS), with keyboard, mouse, and mobile controls.

## Notes

- This project is intended for internal use and development only.
- Do not use in production without proper security and performance adaptations.

---

If you need usage or integration instructions, check the source code or contact the responsible team.

