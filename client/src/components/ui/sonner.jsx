import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    (<Sonner
      theme={theme}
      className="toaster group !right-auto !left-1/2 !-translate-x-1/2" // Ensures proper top-center transform
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#1b1c24] group-[.toaster]:text-white group-[.toaster]:border-[#2f303b] group-[.toaster]:shadow-2xl",
          description: "group-[.toast]:text-neutral-400",
          actionButton:
            "group-[.toast]:bg-[#741bda] group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-[#2a2b33] group-[.toast]:text-neutral-400",
        },
      }}
      {...props} />)
  );
}

export { Toaster }
