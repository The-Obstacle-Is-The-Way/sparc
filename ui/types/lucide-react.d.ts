declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
  }

  type Icon = FC<IconProps>;

  export const Settings2: Icon;
  export const Loader2Icon: Icon;
  export const LoaderIcon: Icon;
  export const Terminal: Icon;
  export const Search: Icon;
  export const BookOpen: Icon;
  export const Database: Icon;
  export const LineChart: Icon;
  export const Lightbulb: Icon;
  export const Download: Icon;
  export const FileText: Icon;
  export const ArrowUp: Icon;
  export const Paperclip: Icon;
  export const Square: Icon;
  export const X: Icon;
  export const Sparkles: Icon;
  export const MessageSquare: Icon;
  export const RotateCw: Icon;
  export const ArrowRight: Icon;
  export const LogOut: Icon;
  export const Trash: Icon;
  export const Undo: Icon;
  export const PanelRightClose: Icon;
  export const PanelRightOpen: Icon;
  export const ChevronsRight: Icon;
  export const LoaderCircle: Icon;
  export const Check: Icon;
  export const Copy: Icon;
  export const MoonIcon: Icon;
  export const SunIcon: Icon;
} 