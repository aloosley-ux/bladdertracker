import { Button as ButtonPrimitive } from "@base-ui/react/button"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button-variants"

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: Parameters<typeof buttonVariants>[0] & ButtonPrimitive.Props) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
