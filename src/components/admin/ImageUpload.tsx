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
        // O preset costuma ser 'ml_default' por padrão em novas contas, 
        // mas deve ser configurado como "Unsigned" no painel do Cloudinary
        formData.append('upload_preset', 'ml_default');

        try {
            const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'djzqwht5b';

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.secure_url) {
                // Otimização: f_auto/q_auto para performance e w_1200 para não subir nada gigante demais
                const optimizedUrl = data.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1200/');
                onChange(optimizedUrl);
            } else {
                console.error('Falha no Cloudinary:', data);
                alert(`Erro no upload: ${data.error?.message || 'Verifique sua configuração de Cloudinary (Cloud Name e Preset Unsigned)'}`);
            }
        } catch (error) {
            console.error('Erro no upload:', error);
            alert('Falha na conexão com o Cloudinary. Verifique sua rede e configurações.');
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
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</label>

            {value ? (
                <div className="relative group rounded-xl overflow-hidden border border-zinc-100 bg-zinc-50 aspect-video">
                    <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="p-3 bg-red-50 text-white rounded-full hover:bg-red-500 transition-colors shadow-lg active:scale-95"
                        >
                            <X size={18} />
                        </button>
                        <div {...getRootProps()} className="p-3 bg-black rounded-full text-white hover:bg-zinc-800 transition-colors shadow-lg cursor-pointer active:scale-95">
                            <Upload size={18} />
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`
            border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer aspect-video flex flex-col items-center justify-center gap-4
            ${isDragActive ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100 hover:border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50'}
          `}
                >
                    <input {...getInputProps()} />
                    {uploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 size={32} className="text-zinc-900 animate-spin" />
                            <span className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Processando...</span>
                        </div>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 transition-colors">
                                <ImageIcon size={24} />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-zinc-900 text-sm mb-0.5">Clique ou arraste a imagem</p>
                                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">PNG, JPG ou WEBP (Máx. 5MB)</p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
