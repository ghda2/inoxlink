import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, X, Upload, Loader2, CheckCircle2 } from 'lucide-react';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Imagem' }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default'); // Você precisará criar um 'unsigned upload preset' no Cloudinary

        try {
            // Usando a API direta do Cloudinary (Client-side upload)
            // Substitua 'gabrielsantos' pelo seu Cloud Name do Cloudinary
            const cloudName = 'gabrielsantos'; // Nome da sua conta no Cloudinary
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.secure_url) {
                // Otimização: Podemos adicionar parâmetros de transformação na URL
                // f_auto = formato automático (webp/avif), q_auto = qualidade automática
                const optimizedUrl = data.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1200/');
                onChange(optimizedUrl);
            }
        } catch (error) {
            console.error('Erro no upload:', error);
            alert('Falha ao subir imagem. Verifique seu Cloud Name e Preset.');
        } finally {
            setUploading(false);
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    });

    return (
        <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</label>

            {value ? (
                <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 aspect-video">
                    <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-xl"
                        >
                            <X size={20} />
                        </button>
                        <div {...getRootProps()} className="p-3 bg-white rounded-full text-black hover:bg-zinc-200 transition-colors shadow-xl cursor-pointer">
                            <Upload size={20} />
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                        <CheckCircle2 size={14} className="text-green-500" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Upload Concluído</span>
                    </div>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`
            border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer aspect-video flex flex-col items-center justify-center gap-4
            ${isDragActive ? 'border-white bg-white/5' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 hover:bg-zinc-900'}
          `}
                >
                    <input {...getInputProps()} />
                    {uploading ? (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 size={40} className="text-white animate-spin" />
                            <span className="text-sm font-bold animate-pulse uppercase tracking-widest">Processando e Otimizando...</span>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                                <ImageIcon size={32} />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-white mb-1">Arraste a imagem ou clique</p>
                                <p className="text-xs text-zinc-500 uppercase tracking-widest leading-loose">PNG, JPG ou WEBP (Max. 10MB)</p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
