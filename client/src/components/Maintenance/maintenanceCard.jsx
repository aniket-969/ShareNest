import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Phone, DollarSign, User, FileText, Wrench } from 'lucide-react'

const MaintenanceCard = ({ maintenance }) => {
  if (!maintenance || maintenance.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <Wrench className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <p className="text-lg font-medium text-card-foreground mb-2">
          No maintenance requests
        </p>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          When maintenance requests are submitted, they'll appear here for easy tracking and management.
        </p>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30'
      case 'in-progress':
        return 'bg-secondary/20 text-secondary border-secondary/30 hover:bg-secondary/30'
      case 'completed':
        return 'bg-accent/20 text-accent border-accent/30 hover:bg-accent/30'
      case 'cancelled':
        return 'bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30'
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30 hover:bg-muted/30'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-primary/10 border-primary/20'
      case 'medium':
        return 'bg-secondary/10 border-secondary/20'
      case 'low':
        return 'bg-accent/10 border-accent/20'
      default:
        return 'bg-card-muted border-card-border'
    }
  }

  return (
    <ScrollArea className="w-full h-[550px]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {maintenance.map(item => (
            <Card 
              key={item._id} 
              className={`group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border-2 ${getPriorityColor(item.priority)} hover:scale-[1.02] relative overflow-hidden bg-card`}
            >
              {/* Status indicator line */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                item.status === 'pending' ? 'bg-primary' :
                item.status === 'in-progress' ? 'bg-secondary' :
                item.status === 'completed' ? 'bg-accent' :
                'bg-muted'
              }`} />
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-lg font-semibold line-clamp-2 flex-1 group-hover:text-primary transition-colors text-card-foreground">
                    {item.title}
                  </CardTitle>
                  <Badge 
                    className={`${getStatusColor(item.status)} text-xs font-medium px-2 py-1 rounded-full border transition-colors shrink-0`}
                  >
                    {item.status?.replace('-', ' ') || 'Unknown'}
                  </Badge>
                </div>
                
                {item.priority && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">Priority:</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        item.priority === 'high' ? 'border-primary/50 text-primary' :
                        item.priority === 'medium' ? 'border-secondary/50 text-secondary' :
                        'border-accent/50 text-accent'
                      }`}
                    >
                      {item.priority}
                    </Badge>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                {item.description && (
                  <div className="flex gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                )}

                <div className="grid gap-3">
                  {item.maintenanceProvider && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Provider</p>
                        <p className="font-medium text-sm truncate text-card-foreground">{item.maintenanceProvider}</p>
                      </div>
                    </div>
                  )}
                  
                  {item.contactPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Contact</p>
                        <p className="font-medium text-sm text-card-foreground">{item.contactPhone}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Estimate</p>
                        <p className="font-semibold text-sm text-accent">
                          ₹{item.costEstimate?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Reported</p>
                        <p className="font-medium text-sm text-card-foreground">
                          {new Date(item.dateReported).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress indicator for in-progress items */}
                {item.status === 'in-progress' && (
                  <div className="mt-4 pt-3 border-t border-card-border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                      <span className="text-xs text-secondary font-medium">Work in Progress</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}

export default MaintenanceCard