import * as React from "react"
import { Toaster as Sonner } from "sonner"

const Toaster = ({ visibleToasts, ...props }) => {
  const [maxToasts, setMaxToasts] = React.useState(4)

  React.useEffect(() => {
    const updateMaxToasts = () => {
      setMaxToasts(window.innerWidth < 640 ? 2 : 4)
    }

    updateMaxToasts()
    window.addEventListener("resize", updateMaxToasts)
    return () => window.removeEventListener("resize", updateMaxToasts)
  }, [])

  return (
    <Sonner
      className="toaster group"
      closeButton
      visibleToasts={visibleToasts ?? maxToasts}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:bg-background group-[.toast]:text-foreground group-[.toast]:border group-[.toast]:border-border/80 group-[.toast]:opacity-90 hover:group-[.toast]:opacity-100 hover:group-[.toast]:bg-muted group-[.toast]:transition-colors",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
