import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import PriorityBadge from '../PriorityBadge.vue';

describe('PriorityBadge.vue', () => {
  it('renders correctly with LOW priority', () => {
    const wrapper = mount(PriorityBadge, {
      props: { priority: 'LOW' }
    });
    expect(wrapper.text()).toContain('Low');
    expect(wrapper.classes()).toContain('prio-low');
  });

  it('renders correctly with CRITICAL priority', () => {
    const wrapper = mount(PriorityBadge, {
      props: { priority: 'CRITICAL' }
    });
    expect(wrapper.text()).toContain('Critical');
    expect(wrapper.classes()).toContain('prio-critical');
  });

  it('renders correctly with unknown priority defaulting to MEDIUM style but showing text', () => {
    const wrapper = mount(PriorityBadge, {
      props: { priority: 'UNKNOWN_PRIO' }
    });
    expect(wrapper.text()).toContain('UNKNOWN_PRIO');
    expect(wrapper.classes()).toContain('prio-medium');
  });
});
