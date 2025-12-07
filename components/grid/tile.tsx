'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
} & React.ComponentProps<typeof Image>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [props.src]);

  return (
    <div className={props.className}>
      <Image
        {...props}
        className={`h-full w-full object-contain ${
          loading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'
        }`}
        onLoad={() => setLoading(false)}
        sizes={
          label?.position === 'center'
            ? '(min-width: 768px) 66vw, 100vw'
            : '(min-width: 768px) 33vw, 100vw'
        }
      />
      {label && (
        <div
          className={`absolute bottom-0 left-0 flex w-full items-center justify-between bg-black/60 p-4 text-white ${
            label.position === 'center' ? 'inset-0' : ''
          }`}
        >
          <div className="flex flex-col">
            <h3 className="text-lg font-bold">{label.title}</h3>
            <p className="text-sm">
              {new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: label.currencyCode,
                currencyDisplay: 'narrowSymbol'
              }).format(parseFloat(label.amount))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}