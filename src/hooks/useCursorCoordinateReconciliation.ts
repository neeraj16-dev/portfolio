import { useEffect, useRef, useCallback } from 'react';

export interface ReconciledCoordinates {
  /** Raw screen-space X (clientX) */
  clientX: number;
  /** Raw screen-space Y (clientY) */
  clientY: number;
  /** Reconciled projection X inside the canvas/container coordinate system */
  projectedX: number;
  /** Reconciled projection Y inside the canvas/container coordinate system */
  projectedY: number;
  /** Delta from the container's computed transform-origin X */
  deltaOriginX: number;
  /** Delta from the container's computed transform-origin Y */
  deltaOriginY: number;
  /** Instantaneous velocity */
  vx: number;
  /** Instantaneous velocity */
  vy: number;
  /** Speed magnitude in px/frame */
  speed: number;
  /** Target cursor active hover state */
  isTargetLocked: boolean;
}

type CoordinateSubscriber = (coords: ReconciledCoordinates) => void;

class CursorCoordinateReconciler {
  private subscribers = new Set<CoordinateSubscriber>();
  private lastX = -100;
  private lastY = -100;
  private lastTime = 0;
  private currentCoords: ReconciledCoordinates = {
    clientX: -100,
    clientY: -100,
    projectedX: -100,
    projectedY: -100,
    deltaOriginX: 0,
    deltaOriginY: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    isTargetLocked: false,
  };

  public subscribe(cb: CoordinateSubscriber): () => void {
    this.subscribers.add(cb);
    return () => {
      this.subscribers.delete(cb);
    };
  }

  /**
   * Reconciles screen-space mouse event coordinates against a container's
   * bounding client rect and computed transform-origin.
   */
  public reconcile(
    clientX: number,
    clientY: number,
    container?: HTMLElement | HTMLCanvasElement | null,
    isTargetLocked = false
  ): ReconciledCoordinates {
    const now = performance.now();
    const dt = Math.max(1, now - (this.lastTime || now));

    let projectedX = clientX;
    let projectedY = clientY;
    let deltaOriginX = 0;
    let deltaOriginY = 0;

    if (container && container.isConnected) {
      const rect = container.getBoundingClientRect();
      const style = window.getComputedStyle(container);

      // Parse container transform-origin (e.g., "50% 50%" or "400px 300px")
      const originParts = style.transformOrigin.split(' ');
      let originX = rect.left + rect.width / 2;
      let originY = rect.top + rect.height / 2;

      if (originParts.length >= 2) {
        const ox = parseFloat(originParts[0]);
        const oy = parseFloat(originParts[1]);
        if (!isNaN(ox) && !isNaN(oy)) {
          originX = rect.left + ox;
          originY = rect.top + oy;
        }
      }

      deltaOriginX = clientX - originX;
      deltaOriginY = clientY - originY;

      // Map client coordinates precisely to container viewport space
      projectX: {
        projectedX = clientX - rect.left;
        projectedY = clientY - rect.top;
      }
    }

    const vx = ((clientX - this.lastX) / dt) * 16.67;
    const vy = ((clientY - this.lastY) / dt) * 16.67;
    const speed = Math.hypot(clientX - this.lastX, clientY - this.lastY);

    this.lastX = clientX;
    this.lastY = clientY;
    this.lastTime = now;

    this.currentCoords = {
      clientX,
      clientY,
      projectedX,
      projectedY,
      deltaOriginX,
      deltaOriginY,
      vx,
      vy,
      speed,
      isTargetLocked,
    };

    this.subscribers.forEach((cb) => {
      try {
        cb(this.currentCoords);
      } catch {
        // safety
      }
    });

    return this.currentCoords;
  }

  public getCurrentCoordinates(): ReconciledCoordinates {
    return this.currentCoords;
  }
}

export const cursorReconciler = new CursorCoordinateReconciler();

/**
 * React hook that coordinates screen-space projection between CursorTrail and TargetCursor.
 * Calculates exact screen-space projection taking into account container transform-origins
 * and CSS transforms (e.g., useVelocity scaleY or perspective).
 */
export function useCursorCoordinateReconciliation(containerRef?: React.RefObject<HTMLElement | HTMLCanvasElement | null>) {
  const latestCoordsRef = useRef<ReconciledCoordinates>(cursorReconciler.getCurrentCoordinates());

  useEffect(() => {
    const unsubscribe = cursorReconciler.subscribe((coords) => {
      latestCoordsRef.current = coords;
    });

    return unsubscribe;
  }, []);

  const reconcilePointerEvent = useCallback(
    (e: PointerEvent | MouseEvent, isTargetLocked = false) => {
      const container = containerRef ? containerRef.current : null;
      return cursorReconciler.reconcile(e.clientX, e.clientY, container, isTargetLocked);
    },
    [containerRef]
  );

  return {
    reconcilePointerEvent,
    getLatestCoordinates: () => latestCoordsRef.current,
    subscribe: (cb: CoordinateSubscriber) => cursorReconciler.subscribe(cb),
  };
}

export default useCursorCoordinateReconciliation;
