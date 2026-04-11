import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import StatusBadge from '../StatusBadge.vue';

describe('StatusBadge.vue', () => {

  it('renders correctly with TODO status', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'TODO' } });
    expect(wrapper.text()).toContain('To Do');
    expect(wrapper.classes()).toContain('status-todo');
  });

  it('renders correctly with IN_PROGRESS status', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'IN_PROGRESS' } });
    expect(wrapper.text()).toContain('In Progress');
    expect(wrapper.classes()).toContain('status-progress');
  });

  it('renders correctly with DONE status', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'DONE' } });
    expect(wrapper.text()).toContain('Done');
    expect(wrapper.classes()).toContain('status-done');
  });

});
