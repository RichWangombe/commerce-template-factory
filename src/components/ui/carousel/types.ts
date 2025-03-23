
import type { 
  EmblaCarouselType as CarouselApi, 
  EmblaOptionsType as CarouselOptions,
  EmblaPluginType as CarouselPlugin,
  UseEmblaCarouselType
} from "embla-carousel-react"

export type { CarouselApi, CarouselOptions, CarouselPlugin }

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
