import React from "react";
import { MaterialSymbol, SymbolCodepoints } from "react-material-symbols";

const SymbolIcon = ({
  icon,
  color,
  size,
  className,
}: {
  icon: SymbolCodepoints;
  color?: string;
  size?: number;
  className?: string;
}) => {
  return (
    <MaterialSymbol
      icon={icon}
      weight={300}
      size={size ?? 24}
      color={color ? color : '#535460'} // Default color
      className={className}
      style={{
        maxWidth: size ?? 24,
        overflow: 'hidden'
      }}
    />
  );
};

export default SymbolIcon;
