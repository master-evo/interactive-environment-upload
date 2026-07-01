import { useState } from 'react';
import type { FilePondFile } from 'filepond';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond/dist/filepond.min.css';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

interface UploadScreenProps {
  onUpload: (modelUrl: string, hdrUrl?: string) => void;
}

export default function UploadScreen({ onUpload }: UploadScreenProps) {
  const [modelFiles, setModelFiles] = useState<FilePondFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (modelFiles.length === 1) {
      const modelFile = modelFiles[0].file;
      if (modelFile) {
        const modelUrl = URL.createObjectURL(modelFile);
        onUpload(modelUrl);
      }
    } else {
      setError('Selecione o arquivo do modelo para continuar.');
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

  return (
    <div className="flex min-h-screen flex-col bg-neutral-900 px-4 pt-8 text-white sm:pt-10">
      <div className="flex justify-center">
        <a
          href="https://www.masterevo.com.br"
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-3 px-2 py-1 text-left transition-transform duration-200 hover:scale-[1.01]"
        >
          <img
            alt="Masterevo Logo"
            loading="lazy"
            width="36"
            height="36"
            decoding="async"
            data-nimg="1"
            src="https://www.masterevo.com.br/masterevo-logo.svg"
            className="shrink-0 transition-transform duration-200 group-hover:scale-105"
            style={{ color: 'transparent' }}
          />
          <h1
            className="text-2xl font-bold tracking-tight text-white transition-transform duration-200 group-hover:-translate-y-px"
            style={{
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.28)',
              textShadow:
                '0 1px 0 rgba(0, 0, 0, 0.35), 0 0 10px rgba(59, 130, 246, 0.24)',
            }}
          >
            Master EVO Loader
          </h1>
        </a>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <form onSubmit={handleSubmit} className="flex w-80 flex-col gap-6">
          <div>
            <label className="mb-2 block font-semibold">
              Modelo 3D (.glb/.gltf):
            </label>
            <FilePond
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
          {error && <div className="text-red-500 text-xs">{error}</div>}
          <button
            type="submit"
            className="mt-2 rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={modelFiles.length !== 1}
          >
            Carregar Modelo
          </button>
        </form>
      </div>
    </div>
  );
}
