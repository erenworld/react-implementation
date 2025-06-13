import { 
  addEventListener, 
  addEventListeners, 
  removeEventListeners 
} from '../src/events';

describe('events functions', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('button');
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  test('addEventListener attaches handler and it triggers on event', () => {
    const handler = jest.fn();
    addEventListener('click', handler, el);

    el.dispatchEvent(new MouseEvent('click'));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('addEventListeners, multiple handlers and removeEventListeners removes them', () => {
    const mouseOverHandler = jest.fn();
    const clickHandler = jest.fn();

    const listeners = {
      mouseover: mouseOverHandler,
      click: clickHandler,
    };

    const added = addEventListeners(listeners, el);

    el.dispatchEvent(new MouseEvent('mouseover'));
    el.dispatchEvent(new MouseEvent('click'));
    expect(mouseOverHandler).toHaveBeenCalledTimes(1);
    expect(clickHandler).toHaveBeenCalledTimes(1);

    removeEventListeners(added, el);

    mouseOverHandler.mockClear();
    clickHandler.mockClear();

    el.dispatchEvent(new MouseEvent('mouseover'));
    el.dispatchEvent(new MouseEvent('click'));
    expect(mouseOverHandler).not.toHaveBeenCalled();
    expect(clickHandler).not.toHaveBeenCalled();
  });
});
