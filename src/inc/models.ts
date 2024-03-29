import { intersectionObserver } from "./intersectionObserver";
import { mutationObserver } from "./mutationObserver";
import { resizeObserver } from "./resizeObserver";

export type Selector = string;
export type Value = string | number | boolean;
export type Callback = (event: EventType) => void;
export type AnyCallback = (...args: any[]) => void;
export type ExtendElement = Element | Window | Document;
export interface ConditionalConfig {
  selector?: string;
  media?: string | Array<string>;
  attrNameContains?: RegExp | string | Array<string | RegExp>;
  valueContains?: RegExp | Value | Array<Value | RegExp>;
  oldValueContains?: RegExp | Value | Array<Value | RegExp>;
  isFullyVisible?: boolean;
  isVisible?: boolean;
  isFocused?: boolean;
  isChecked?: boolean;
  isDisabled?: boolean;
  is?: (event: any) => boolean;
}

export type MutationObserverHandler = (
  mutations: Array<MutationRecord>
) => void;
export type ResizeObserverHandler = (
  entries: Array<ResizeObserverEntry>
) => void;
export type IntersectionObserverHandler = (
  entries: Array<IntersectionObserverEntry>
) => void;

export type ConditionsStorage = Map<keyof ConditionalConfig, ConditionFunction>;
export type ConditionFunction = (
  configValue: any,
  event: EventType,
  eventName?: EventName,
  eventData?: EventData
) => boolean;

export const onResizeEventName = "onResize";
export const onChangeAttributeEventName = "onChangeAttribute";
export const onAddAttributeEventName = "onAddAttribute";
export const onDeleteAttributeEventName = "onDeleteAttribute";
export const onAddClassNameEventName = "onAddClassName";
export const onDeleteClassNameEventName = "onDeleteClassName";
export const onVisibilityEventName = "onVisibility";
export const onVisibleEventName = "onVisible";
export const onHiddenEventName = "onHidden";


export type EventName =
  | typeof onResizeEventName
  | typeof onChangeAttributeEventName
  | typeof onAddAttributeEventName
  | typeof onDeleteAttributeEventName
  | typeof onAddClassNameEventName
  | typeof onDeleteClassNameEventName
  | typeof onVisibilityEventName
  | typeof onVisibleEventName
  | typeof onHiddenEventName


export const intersectionEvents: Array<Partial<EventName>> = [
  onHiddenEventName,
  onVisibleEventName,
  onVisibilityEventName,
];

export const mutationObserverEvents: Array<Partial<EventName>> = [
  onChangeAttributeEventName,
  onAddAttributeEventName,
  onDeleteAttributeEventName,
  onAddClassNameEventName,
  onDeleteClassNameEventName,
];

export type ImplementedHandler = (e: any) => any | void;

export type ListenerConfig = {
  once?: boolean;
  lazy?: boolean;
};
export type EventData = {
  el: ExtendElement;
  eventName: EventName;
  callback: Callback;
  conditionalConfig: ConditionalConfig;
  state?: {
    lazyCallback?: AnyCallback;
  };
  listenerConfig: ListenerConfig;
};

export interface ElemenExtendMethods {
  addConditionalEventListener(
    eventName: EventName,
    callback: Callback,
    conditionalConfig?: ConditionalConfig,
    eventListenerOptions?: any
  ): void;
  removeConditionalEventListener(
    eventName: EventName,
    callback: Callback
  ): void;
}

export type EventStorageData = {
  implementedHandler: ImplementedHandler;
  callbacks: Map<Callback, EventData>;
};

export type EventStorageEl = {
  [eventName: string]: EventStorageData;
};

export type EventStorage = Map<ExtendElement, EventStorageEl>;

export interface ConditionalEventsOptions {
  customEvents?: boolean;
  resizeObserverOptions?: {
    box?: "content-box" | "border-box" | "device-pixel-content-box";
  };
  mutationObserverOptions?: {
    subtree?: boolean;
    globalSingleListener?: boolean;
    rootElement?: Element;
  };
  intersectionObserverOptions?: {
    rootMargin?: IntersectionObserver["rootMargin"];
  };
}

export interface EventType extends CustomEvent, Event {}

export class onResizeDetail {
  rect: DOMRectReadOnly;
  constructor(
    public entry: ResizeObserverEntry,
    public prevRect: DOMRectReadOnly | DOMRect
  ) {
    this.rect = entry.contentRect;
  }
}

export class onChangeAttributeDetail {
  attributeName: string;
  valueJSON: any = null;
  oldValueJSON: any = null;
  oldValue: any;
  constructor(public entry: MutationRecord, public value: string) {
    this.attributeName = entry.attributeName;
    this.oldValue = entry.oldValue;
    try {
      this.valueJSON = JSON.parse(value);
    } catch (e) {}
    try {
      this.oldValueJSON = JSON.parse(this.oldValue);
    } catch (e) {}
  }
}

export class onDeleteAttributeDetail {
  oldValueJSON: any = null;
  oldValue: any;
  attributeName: string;
  constructor(public entry: MutationRecord) {
    this.oldValue = entry.oldValue;
    this.attributeName = entry.attributeName;
    try {
      this.oldValueJSON = JSON.parse(this.oldValue);
    } catch (e) {}
  }
}

export class onAddAttributeDetail {
  valueJSON: any = null;
  attributeName: string;
  constructor(public entry: MutationRecord, public value: string) {
    this.attributeName = entry.attributeName;
    try {
      this.valueJSON = JSON.parse(value);
    } catch (e) {}
  }
}

export class onAddClassNameDetail {
  constructor(
    public entry: MutationRecord,
    public changedСlassList: string[],
    public oldClassList: string[],
    public currentClassList: string[]
  ) {}
}

export class onDeleteClassNameDetail {
  constructor(
    public entry: MutationRecord,
    public changedСlassList: string[],
    public oldClassList: string[],
    public currentClassList: string[]
  ) {}
}

export class onVisibilityDetail {
  isFullyVisible: boolean;
  isVisible: boolean;
  isHidden: boolean;
  constructor(public entry: IntersectionObserverEntry) {
    let rectJSON = JSON.stringify(entry.intersectionRect);
    let isVisible = !!Object.values(JSON.parse(rectJSON)).find(
      (e: number) => e > 0
    );
    this.isFullyVisible = JSON.stringify(entry.boundingClientRect) === rectJSON;
    this.isHidden = !isVisible;
  }
}

export interface ObserverControllers {
  mutationObserver: mutationObserver;
  resizeObserver: resizeObserver;
  intersectionObserver: intersectionObserver;
}
export class onVisibleDetail {
  isVisible: boolean;
  constructor(public entry: IntersectionObserverEntry) {
    let rectJSON = JSON.stringify(entry.intersectionRect);
    this.isVisible = !!Object.values(JSON.parse(rectJSON)).find(
      (e: number) => e > 0
    );
  }
}

export type RemoveEventsMethod = (
  eventName?: EventName,
  element?: ExtendElement,
  callback?: Callback
) => void;

export interface InitReturns {
  setOptions: any,
  mutationObserver: mutationObserver;
  resizeObserver: resizeObserver;
  intersectionObserver: intersectionObserver;
  options: ConditionalEventsOptions;
  removeEvents: RemoveEventsMethod;
}

declare global {
  interface Element extends ElemenExtendMethods {
    prevOnResizeRect: DOMRectReadOnly;
    prevOnVisibleState: boolean;
  }
  interface Document extends ElemenExtendMethods {
    conditionsStorage: ConditionsStorage;
    eventStorage: EventStorage;
    mutationObserver: MutationObserver;
    resizeObserver: ResizeObserver;
    intersectionObserver: IntersectionObserver;
  }
  interface Window extends ElemenExtendMethods {
    ConditionalEventsOptions: ConditionalEventsOptions;
    ConditionalEvents: any;
  }
}
