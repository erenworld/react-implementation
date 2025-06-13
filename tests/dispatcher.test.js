import { Dispatcher } from "../src/dispatcher"

describe('Dispatcher', () => {
  test('handler after dispatch', () => {
    const dispatcher = new Dispatcher();
    const handler = jest.fn();

    dispatcher.subscribe("say-hello", handler);
    dispatcher.dispatch("say-hello", "world");
    expect(handler).toHaveBeenCalledWith("world");
  });
});
