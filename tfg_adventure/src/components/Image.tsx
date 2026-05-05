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

    if (hasError) {
        return (
            <div
                className={`flex items-center justify-center bg-primary ${containerClassName}`}
            >
                <img
                    src={fallback}
                    alt="Sin imagen disponible"
                    className={`w-[${fallbackSize}px] h-[${fallbackSize}px] opacity-40`}
                    style={{ width: `${fallbackSize}px`, height: `${fallbackSize}px` }}
                />
            </div>
        );
    }

    return (
        <img
            {...props}
            onError={(e) => {
                setHasError(true);
                props.onError?.(e);
            }}
        />
    );
}
