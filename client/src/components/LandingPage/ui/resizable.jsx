'use client'

import { GripVertical } from 'lucide-react'
import * as ResizablePrimitive from 'react-resizable-panels'

import { cn } from '@/lib/utils'

const ResizablePanelGroup = ({
  className,
  ...props
}.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      'flex h-full w-full data-[panel-group-direction=vertical]-col',
      className,
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      'relative flex w-px items-center justify-center bg-border after after-y-0 after-1/2 after-1 after:-translate-x-1/2 focus-visible-none focus-visible-1 focus-visible-ring focus-visible-offset-1 data-[panel-group-direction=vertical]-px data-[panel-group-direction=vertical]-full data-[panel-group-direction=vertical]-0 data-[panel-group-direction=vertical]-1 data-[panel-group-direction=vertical]-full data-[panel-group-direction=vertical]:-translate-y-1/2 data-[panel-group-direction=vertical]-x-0 [&[data-panel-group-direction=vertical]>div]-90',
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
