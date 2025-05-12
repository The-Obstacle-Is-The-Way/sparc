declare module 'posthog-js/react' {
  import { ReactNode } from 'react';

  interface PostHog {
    capture: (event: string, properties?: any) => void;
    identify: (distinctId: string, properties?: any) => void;
    reset: () => void;
    people: {
      set: (properties: any) => void;
    };
  }

  export function usePostHog(): PostHog;

  export interface PostHogProviderProps {
    client: PostHog;
    children: ReactNode;
  }

  export function PostHogProvider(props: PostHogProviderProps): JSX.Element;
} 