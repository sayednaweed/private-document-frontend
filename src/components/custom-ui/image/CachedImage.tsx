import axiosClient from "@/lib/axois-client";
import { cn } from "@/lib/utils";
import { UserRound } from "lucide-react";
import React, { useState, useEffect } from "react";

// Image data interface
export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  loaderClassName?: string;
  iconClassName?: string;
  src: string | undefined;
  fallback?: any;
}

// Custom image cache singleton
class ImageCache {
  private static instance: ImageCache;
  private cache: Record<string, string>;

  private constructor() {
    this.cache = {};
  }

  public static getInstance(): ImageCache {
    if (!ImageCache.instance) {
      ImageCache.instance = new ImageCache();
    }
    return ImageCache.instance;
  }

  public getImage(src: string): string | null {
    return this.cache[src] || null;
  }

  public cacheImage(src: string, img: string): void {
    this.cache[src] = img;
  }
}

// Image component with caching
const CachedImage = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      className,
      loaderClassName,
      fallback,
      iconClassName,
      children,
      ...props
    },
    ref
  ) => {
    const [image, setImage] = useState<string | null>(null);
    const [failed, setFailed] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<boolean>(false);
    const download = async () => {
      try {
        if (src == null || src == undefined) {
          setAvatar(true);
          setImage(null);
          return;
        }
        if (typeof src == "object") {
          setImage(URL.createObjectURL(src));
          return;
        }
        const cache = ImageCache.getInstance();

        // Check if image is already cached
        const cachedImage = cache.getImage(src);
        if (cachedImage) {
          setImage(cachedImage);
        } else {
          // Image not cached, fetch and cache
          const response = await axiosClient.get(src, {
            responseType: "blob", // Important
          });
          if (response.status == 200) {
            // Create a temporary URL for the downloaded image
            const imageUrl = URL.createObjectURL(new Blob([response.data]));
            if (response.data.type == "application/json") {
              setFailed(true);
              return;
            }
            setImage(imageUrl);
            cache.cacheImage(src, imageUrl);
          }
        }
      } catch (error: any) {
        console.log(error);
        setFailed(true);
      }
    };
    useEffect(() => {
      download();
    }, [src]);

    if (!image) {
      return (
        <div
          className={cn(
            `flex flex-col justify-center items-center mx-auto ${
              !failed && !avatar && "animate-pulse"
            }`,
            loaderClassName
          )}
        >
          {avatar ? (
            <UserRound
              className={cn("size-9 text-primary/95", iconClassName)}
            />
          ) : (
            <>
              {failed && fallback ? (
                fallback
              ) : (
                <svg
                  onClick={download}
                  className={cn("opacity-50 fill-primary size-1/3")}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 18"
                >
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
              )}
            </>
          )}
        </div>
      );
    }
    return (
      <img
        ref={ref}
        className={cn("", className)}
        {...props}
        src={image}
        alt={alt}
      />
    );
  }
);

export default CachedImage;
