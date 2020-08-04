import { DragDropManager, Unsubscribe, Listener, Identifier } from 'dnd-core-cjs';
import { DropTargetMonitor } from '../interfaces';
export declare class DropTargetMonitorImpl implements DropTargetMonitor {
    private internalMonitor;
    private targetId;
    constructor(manager: DragDropManager);
    receiveHandlerId(targetId: Identifier | null): void;
    getHandlerId(): Identifier | null;
    subscribeToStateChange(listener: Listener, options?: {
        handlerIds: Identifier[] | undefined;
    }): Unsubscribe;
    canDrop(): boolean;
    isOver(options: {
        shallow?: boolean;
    }): boolean;
    getItemType(): string | symbol | null;
    getItem(): any;
    getDropResult(): any;
    didDrop(): boolean;
    getInitialClientOffset(): import("dnd-core-cjs").XYCoord | null;
    getInitialSourceClientOffset(): import("dnd-core-cjs").XYCoord | null;
    getSourceClientOffset(): import("dnd-core-cjs").XYCoord | null;
    getClientOffset(): import("dnd-core-cjs").XYCoord | null;
    getDifferenceFromInitialOffset(): import("dnd-core-cjs").XYCoord | null;
}
