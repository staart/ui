export interface Filter {
  title: string;
  name: string;
  type: "string" | "int" | "float" | "date" | "datetime" | "bool" | "enum";
  filterType?: string;
  value?: string;
  options?: Record<string, string>;
}
