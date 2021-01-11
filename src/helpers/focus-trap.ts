import Mousetrap from "mousetrap";

const runInSeries = (tasks: Function[]) => (...initialArgs: any[]) =>
  tasks.reduce((memo, task) => (memo = [...[task(...memo)]]), initialArgs || []);

const elementIsVisible = (element: Element) => {
  let computedStyle = document.defaultView.getComputedStyle(element, null);
  return (
    computedStyle.getPropertyValue("display") !== "none" &&
    computedStyle.getPropertyValue("visibility") !== "hidden"
  );
};

const FOCUSABLE_ELEMENTS = [
  "a[href]",
  "area[href]",
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  "select:not([disabled]):not([aria-hidden])",
  "textarea:not([disabled]):not([aria-hidden])",
  "button:not([disabled]):not([aria-hidden])",
  "iframe",
  "object",
  "embed",
  "[contenteditable]",
  '[tabindex]:not([tabindex^="-"])',
];

export function focusTrap(node: Element) {
  const keyboardShortcuts = {
    "alt+tab": previous,
    end: focusLastItem,
    home: focusFirstItem,
    "shift+tab": previous,
    down: next,
    tab: next,
    up: previous,
  };

  Object.entries(keyboardShortcuts).forEach(([keys, handler]) => {
    Mousetrap.bind(
      keys,
      runInSeries([
        (event: Event) => ({ event }),
        preventDefault,
        stopPropagation,
        getAllFocusableChildren,
        getCurrentlyFocusedItem,
        handler,
      ])
    );
  });

  function preventDefault(context: { event: Event }) {
    context.event.preventDefault();
    return context;
  }

  function stopPropagation(context: { event: Event }) {
    context.event.stopPropagation();
    return context;
  }

  function getAllFocusableChildren(context: { event: Event }) {
    let focusables: Element[] = [];
    FOCUSABLE_ELEMENTS.forEach((elt) => focusables.push(...Array.from(node.querySelectorAll(elt))));
    return {
      ...context,
      allFocusableItems: focusables.filter(elementIsVisible),
    };
  }

  function getCurrentlyFocusedItem(context: { event: Event }) {
    let currentlyFocusedItem = document.activeElement;

    if (currentlyFocusedItem && !node.contains(currentlyFocusedItem)) {
      return context;
    }

    return {
      ...context,
      currentlyFocusedItem,
    };
  }

  function next({ allFocusableItems, currentlyFocusedItem }) {
    if (!currentlyFocusedItem) {
      allFocusableItems[0] && allFocusableItems[0].focus();
      return;
    }

    let currentlyFocusedIndex = allFocusableItems.indexOf(currentlyFocusedItem);

    if (allFocusableItems.length - 1 === currentlyFocusedIndex) {
      allFocusableItems[0] && allFocusableItems[0].focus();
      return;
    }

    allFocusableItems[currentlyFocusedIndex + 1] &&
      allFocusableItems[currentlyFocusedIndex + 1].focus();
  }

  function previous({ allFocusableItems, currentlyFocusedItem }) {
    if (!currentlyFocusedItem) {
      allFocusableItems[allFocusableItems.length - 1].focus();
      return;
    }

    let currentlyFocusedIndex = allFocusableItems.indexOf(currentlyFocusedItem);

    if (currentlyFocusedIndex === 0) {
      allFocusableItems[allFocusableItems.length - 1] &&
        allFocusableItems[allFocusableItems.length - 1].focus();
      return;
    }

    allFocusableItems[currentlyFocusedIndex - 1] &&
      allFocusableItems[currentlyFocusedIndex - 1].focus();
  }

  function focusFirstItem({ allFocusableItems }) {
    allFocusableItems[0] && allFocusableItems[0].focus();
  }

  function focusLastItem({ allFocusableItems }) {
    allFocusableItems[allFocusableItems.length - 1].focus();
  }

  return {
    destroy() {
      Object.keys(keyboardShortcuts).forEach((key) => Mousetrap.unbind(key));
    },
  };
}
