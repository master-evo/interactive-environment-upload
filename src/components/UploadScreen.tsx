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
            fileValidateTypeLabelExpectedTypes="Modelo 3D (.glb/.gltf)"
            fileValidateTypeLabelExpectedTypesMap={{
              'model/gltf-binary': '.glb',
            }}
            labelFileTypeNotAllowed="Apenas .glb e .gltf são permitidos"
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
            fileValidateTypeLabelExpectedTypes="HDR Lightmap (.hdr/.exr)"
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
