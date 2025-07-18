import { test, expect, beforeEach, afterEach } from 'vitest'
import { createApp } from 'fe-fwk'
import { Counter } from './counter'

let app = null;

beforeEach(() => {
    app = createApp(Counter);
    app.mount(document.body)
})

afterEach(async () => {
    await nextTick();
    app.unmount();
    await nextTick();
})

test('Counter starts at 0', () => {
    const counter = 
        document.querySelector('[data-qa="counter"]');
    expect(counter.textContent).toBe('0');
})

test('Counter with increment of 1', () => {
    const btn = document.querySelector('[data-qa="increment"]');
    const counter = document.querySelector('[data-qa="counter"]');

    btn.click();

    expect(counter.textContent).toBe('1');
})

test('the component loads data from a server', async () => {
    const app = createApp(MyComponent);
    app.mount(document.body);

    await nextTick();
})

test('Show loading indicator during fetching', () => {
    // If nextTick() isn't awaited for, the onMounted() hooks haven't run,
    // so the loading should be displayed.

    expect(document.body.innerHTML).toContain('Loading...');
})
