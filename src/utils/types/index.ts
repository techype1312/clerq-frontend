import { z } from "zod";

export type RowData = {
    id: string;
    label: string;
    formattedValue?: any;
    type: string;
    values?: Record<string, any>;
    schema?: z.ZodObject<Record<string, any>>;
    description?: string;
    isEditable?: boolean;
    actions?: Record<string, (data?: any) => Promise<false | void>>;
  };
  