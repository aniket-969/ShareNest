'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]-background group-[.toaster]-foreground group-[.toaster]-border group-[.toaster]-lg',
          description: 'group-[.toast]-muted-foreground',
          actionButton:
            'group-[.toast]-primary group-[.toast]-primary-foreground',
          cancelButton:
            'group-[.toast]-muted group-[.toast]-muted-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
