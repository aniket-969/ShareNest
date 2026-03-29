'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

function InputGroup({ className, ...props }.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        'group/input-group border-input dark-input/30 shadow-xs relative flex w-full items-center rounded-md border outline-none transition-[color,box-shadow]',
        'h-9 has-[>textarea]-auto',

        // Variants based on alignment.
        'has-[>[data-align=inline-start]]&>input]-2',
        'has-[>[data-align=inline-end]]&>input]-2',
        'has-[>[data-align=block-start]]-auto has-[>[data-align=block-start]]-col has-[>[data-align=block-start]]&>input]-3',
        'has-[>[data-align=block-end]]-auto has-[>[data-align=block-end]]-col has-[>[data-align=block-end]]&>input]-3',

        // Focus state.
        'has-[[data-slot=input-group-control]-visible]-ring has-[[data-slot=input-group-control]-visible]-1',

        // Error state.
        'has-[[data-slot][aria-invalid=true]]-destructive/20 has-[[data-slot][aria-invalid=true]]-destructive dark-[[data-slot][aria-invalid=true]]-destructive/40',

        className,
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "text-muted-foreground flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group-50 [&>kbd]-[calc(var(--radius)-5px)] [&>svg([class*='size-'])]-4",
  {
    variants: {
      align: {
        'inline-start':
          'order-first pl-3 has-[>button]-[-0.45rem] has-[>kbd]-[-0.35rem]',
        'inline-end':
          'order-last pr-3 has-[>button]-[-0.4rem] has-[>kbd]-[-0.35rem]',
        'block-start':
          '[.border-b]-3 order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group-2.5',
        'block-end':
          '[.border-t]-3 order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group-2.5',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
)

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  'flex items-center gap-2 text-sm shadow-none',
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]-2 [&>svg([class*='size-'])]-3.5",
        sm: 'h-8 gap-1.5 rounded-md px-2.5 has-[>svg]-2.5',
        'icon-xs':
          'size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]-0',
        'icon-sm': 'size-8 p-0 has-[>svg]-0',
      },
    },
    defaultVariants: {
      size: 'xs',
    },
  },
)

function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}.ComponentProps<typeof Button>, 'size'> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        "text-muted-foreground flex items-center gap-2 text-sm [&_svg([class*='size-'])]-4 [&_svg]-events-none",
        className,
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}.ComponentProps<'input'>) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        'flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible-0 dark-transparent',
        className,
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}.ComponentProps<'textarea'>) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        'flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible-0 dark-transparent',
        className,
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
