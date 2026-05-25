import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0 text-[0.6875rem] font-medium tracking-wide whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary/12 text-primary",
        secondary: "bg-muted text-muted-foreground",
        destructive: "bg-destructive/10 text-destructive",
        outline: "border-border/70 bg-background/60 text-muted-foreground",
        ghost: "bg-transparent text-muted-foreground",
        link: "text-primary underline-offset-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
