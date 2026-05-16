import {type ImgHTMLAttributes, useState} from 'react';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    fallback?: string;
    containerClassName?: string;
    fallbackSize?: number;
}

export default function Image({
                                  fallback = '/Img/Icons/sin-imagen.png',
                                  containerClassName = '',
                                  fallbackSize = 50,
                                  ...props
                              }: ImageProps) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const hasValidSrc = Boolean(props.src && props.src.trim() !== '');

    if (hasError || !hasValidSrc) {
        return (
            <div
                className={`flex items-center justify-center bg-gradient-to-br from-[#3a3a3a] to-[#1a1a1a] w-full h-full ${containerClassName}`}
            >
                <img
                    src={fallback}
                    alt="Sin imagen disponible"
                    className="opacity-30 max-w-[25%] max-h-[25%]"
                />
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${containerClassName}`}>
            {isLoading && (
                <div className="absolute inset-0 z-10 bg-[#2a2a2a] overflow-hidden">
                    <div
                        className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"/>
                </div>
            )}
            <img
                {...props}
                className={`${props.className ?? ''} ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
                onLoad={(e) => {
                    setIsLoading(false);
                    props.onLoad?.(e);
                }}
                onError={(e) => {
                    setHasError(true);
                    props.onError?.(e);
                }}
            />
        </div>
    );
}
