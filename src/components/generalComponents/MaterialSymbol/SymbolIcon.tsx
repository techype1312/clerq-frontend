import React from "react";
import { MaterialSymbol } from "react-material-symbols";
import { SymbolCodepoints } from "react-material-symbols";

const SymbolIcon = ({
  icon,
  color,
  size,
}: {
  icon: SymbolCodepoints;
  color?: string;
  size?: number;
}) => {
  return (
    <MaterialSymbol
      icon={icon}
      weight={300}
      size={size ?? 24}
      color={color ? color : '#535460'} // Default color
    />
  );
};

export default SymbolIcon;
