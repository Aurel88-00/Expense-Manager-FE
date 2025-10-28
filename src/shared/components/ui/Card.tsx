import type { TCardProps, TCardBodyProps, TCardHeaderProps, TCardFooterProps, TStatCardProps } from './interface';

export const Card = ({ children, className = '', hoverable = false }: TCardProps) => (
  <div className={`bg-card overflow-hidden shadow-sm rounded-lg transition-all duration-300 ${
    hoverable ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''
  } ${className}`}>
    {children}
  </div>
);


export const CardBody = ({ children, className = '' }: TCardBodyProps) => (
  <div className={`px-6 py-5 sm:p-6 ${className}`}>
    {children}
  </div>
);


export const CardHeader = ({ children, className = '', border = true }: TCardHeaderProps) => (
  <div className={`px-6 py-4 sm:px-6 ${border ? 'border-b border-border' : ''} ${className}`}>
    {children}
  </div>
);


export const CardFooter = ({ children, className = '', border = true }: TCardFooterProps) => (
  <div className={`px-6 py-3 bg-muted sm:px-6 ${border ? 'border-t border-border' : ''} ${className}`}>
    {children}
  </div>
);


export const StatCard = ({ icon, label, value, className = '', trend }: TStatCardProps) => (
  <Card className={className} hoverable>
    <CardBody>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <dt className="text-sm font-medium text-muted-foreground truncate">{label}</dt>
          <dd className="mt-2 text-2xl font-bold text-foreground">{value}</dd>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span className={`text-sm font-medium ${
                trend.positive ? 'text-success' : 'text-destructive'
              }`}>
                {trend.positive ? '+' : '-'}{trend.value}%
              </span>
              <span className="text-sm text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        <div className="ml-4 shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </div>
    </CardBody>
  </Card>
);
