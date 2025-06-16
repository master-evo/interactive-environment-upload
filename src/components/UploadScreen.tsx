import { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond/dist/filepond.min.css';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

interface UploadScreenProps {
  onUpload: (modelUrl: string, hdrUrl: string) => void;
}

export default function UploadScreen({ onUpload }: UploadScreenProps) {
  const [modelFiles, setModelFiles] = useState<any[]>([]);
  const [hdrFiles, setHdrFiles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (modelFiles.length === 1 && hdrFiles.length === 1) {
      const modelFile = modelFiles[0].file;
      const hdrFile = hdrFiles[0].file;
      if (modelFile && hdrFile) {
        const modelUrl = URL.createObjectURL(modelFile);
        const hdrUrl = URL.createObjectURL(hdrFile);
        onUpload(modelUrl, hdrUrl);
      }
    } else {
      setError('Selecione ambos os arquivos para continuar.');
    }
  }

  function detectGLTF(source: File, detectedType: string): Promise<string> {
    return new Promise((resolve) => {
      const name = source.name.toLowerCase();
      if (name.endsWith('.glb')) {
        resolve('model/gltf-binary');
      } else if (name.endsWith('.gltf')) {
        resolve('model/gltf+json');
      } else {
        resolve(detectedType);
      }
    });
  }

  function detectHDR_EXR(source: File, type: string): Promise<string> {
    return new Promise((resolve) => {
      const name = source.name.toLowerCase();
      if (name.endsWith('.hdr')) {
        resolve('image/vnd.radiance');
      } else if (name.endsWith('.exr')) {
        resolve('image/exp-rgb');
      } else {
        resolve(type);
      }
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-neutral-900 text-white">
      <h1 className="text-2xl font-bold mb-4">
        Upload do Modelo 3D e Lightmap HDR
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-80">
        <div>
          <label className="mb-2 block font-semibold">
            Modelo 3D (.glb/.gltf):
          </label>
          <FilePond
            files={modelFiles}
            onupdatefiles={setModelFiles}
            allowMultiple={false}
            maxFiles={1}
            name="model"
            labelIdle="Arraste ou clique para selecionar o modelo (.glb/.gltf)"
            acceptedFileTypes={['model/gltf-binary', 'model/gltf+json']}
            fileValidateTypeDetectType={detectGLTF}
            fileValidateTypeLabelExpectedTypesMap={{
              'model/gltf-binary': '.glb',
              'model/gltf+json': '.gltf',
            }}
            labelFileTypeNotAllowed="Apenas .glb ou .gltf são permitidos"
            required
          />
        </div>
        <div>
          <label className="mb-2 block font-semibold">
            Lightmap HDR (.hdr/.exr):
          </label>
          <FilePond
            files={hdrFiles}
            onupdatefiles={setHdrFiles}
            allowMultiple={false}
            maxFiles={1}
            name="hdr"
            labelIdle="Arraste ou clique para selecionar o HDR (.hdr/.exr)"
            acceptedFileTypes={['image/vnd.radiance', 'image/exp-rgb']}
            fileValidateTypeDetectType={detectHDR_EXR}
            fileValidateTypeLabelExpectedTypesMap={{
              'image/vnd.radiance': '.hdr',
              'image/exp-rgb': '.exr',
            }}
            labelFileTypeNotAllowed="Apenas .hdr e .exr são permitidos"
            required
          />
        </div>
        {error && <div className="text-red-500 text-xs">{error}</div>}
        <button
          type="submit"
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-50"
          disabled={modelFiles.length !== 1 || hdrFiles.length !== 1}
        >
          Carregar Sandbox
        </button>
      </form>
    </div>
  );
}
