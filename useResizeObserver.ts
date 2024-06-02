import { useCallback, useContext, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import { HeightProviderContext } from './HeightProvider.context';

type Args = Partial<{
  hid?: string;
}>;

const useResizeObserver = (args?: Args) => {
  const { registerHeight, unregisterHeight } = useContext(HeightProviderContext);
  const ref = useRef(null);
  const componentId = useRef(args?.hid || Math.random().toString(36).substring(2, 15)); // Unique ID for each component
  const resizeObserver = useRef<ResizeObserver | null>(null);

  const getAbsoluteHeight = (el: HTMLElement) => {
    const style = window.getComputedStyle(el);

    const marginTop = parseFloat(style.marginTop);
    const marginBottom = parseFloat(style.marginBottom);
    const paddingTop = parseFloat(style.paddingTop);
    const paddingBottom = parseFloat(style.paddingBottom);
    const borderTop = parseFloat(style.borderTopWidth);
    const borderBottom = parseFloat(style.borderBottomWidth);

    return (
      el.offsetHeight +
      marginTop +
      marginBottom +
      paddingTop +
      paddingBottom +
      borderTop +
      borderBottom
    );
  };

  const resizeHandler: ResizeObserverCallback = (entries) => {
    for (const entry of entries) {
      if (ref.current === entry.target) {
        registerHeight(componentId.current, getAbsoluteHeight(entry.target as HTMLElement));
      }
    }
  };

  const debouncedResizeHandler = useCallback(
    debounce(resizeHandler, 100, { leading: true, trailing: true }),
    [ref]
  );

  useEffect(() => {
    resizeObserver.current?.disconnect();

    resizeObserver.current = new ResizeObserver(debouncedResizeHandler);

    if (ref.current) {
      resizeObserver.current?.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        resizeObserver.current?.unobserve(ref.current);
        resizeObserver.current?.disconnect();
      }

      unregisterHeight(componentId.current); // Remove height on unmount
    };
  }, [registerHeight, unregisterHeight]);

  return ref;
};

export default useResizeObserver;
