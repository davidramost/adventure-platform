import { useState, type ImgHTMLAttributes } from 'react';

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

    const hasValidSrc = Boolean(props.src && props.src.trim() !== '');

    if (hasError || !hasValidSrc) {
        return (
            <div
                className={`flex items-center justify-center bg-[#2a2a2a] ${containerClassName}`}
            >
                <img
                    src={fallback}
                    alt="Sin imagen disponible"
                    className="opacity-40"
                    style={{ width: `${fallbackSize}px`, height: `${fallbackSize}px` }}
                />
            </div>
        );
    }

    return (
        <img
            {...props}
            src={props.src}
            onError={(e) => {
                setHasError(true);
                props.onError?.(e);
            }}
        />
    );
}
