// Old Input with no icon
// import * as React from "react"

// import { cn } from "@/utils/utils"

// export interface InputProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {}

// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ className, type, ...props }, ref) => {
//     return (
//       <input
//         type={type}
//         className={cn(
//           "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     )
//   }
// )
// Input.displayName = "Input"

// export { Input }

import * as React from "react";

import { cn } from "@/utils/utils";
import { LucideIcon } from "lucide-react";
import { SymbolCodepoints } from "react-material-symbols";
import SymbolIcon from "../generalComponents/MaterialSymbol/SymbolIcon";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: SymbolCodepoints;
  endIcon?: SymbolCodepoints;
  outerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, outerClassName, type, startIcon, endIcon, ...props }, ref) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;

    return (
      <div className={cn("w-full relative border-input", outerClassName)}>
        {StartIcon && (
          <div className="relative">
            <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2">
              <SymbolIcon icon={startIcon} />
            </div>
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background py-2 px-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            startIcon ? "pl-8" : "",
            endIcon ? "pr-8" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <div className="relative">
            <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2">
              <SymbolIcon icon={endIcon} />
            </div>
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
