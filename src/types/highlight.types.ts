export type ICreateHighlightInput = {
    title: string;
    description: string;
    image?: string | null;
  };
  
  export type IUpdateHighlightInput = {
    title?: string;
    description?: string;
    image?: string | null;
  };

  type HighlightItem = {
    id: string;
    title: string;
    description: string;
    image?: string;
    createdAt?: string;
  };
  export type TResponseHighlight<T = unknown> = HighlightItem & T;