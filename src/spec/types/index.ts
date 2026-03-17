export type LinkProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
  params?: Record<string, string | number>;
};
