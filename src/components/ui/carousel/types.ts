
import type { 
  UseEmblaCarouselType 
} from "embla-carousel-react"

// Define the correct types based on the embla-carousel-react package
export type CarouselApi = NonNullable<UseEmblaCarouselType[1]>
export type CarouselOptions = Parameters<typeof import("embla-carousel-react").default>[0]
export type CarouselPlugin = Parameters<typeof import("embla-carousel-react").default>[1]

export type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

export type CarouselContextProps = {
  carouselRef: UseEmblaCarouselType[0]
  api: UseEmblaCarouselType[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps
