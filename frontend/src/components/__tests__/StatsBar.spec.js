import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import StatsBar from '../StatsBar.vue';

describe('StatsBar.vue', () => {

  it('calculates statistics correctly from an empty projects array', () => {
    const wrapper = mount(StatsBar, { props: { projects: [] } });
    const values = wrapper.findAll('.stat-value');
    expect(values.length).toBe(4);
    expect(values[0].text()).toBe('0'); // Total
    expect(values[1].text()).toBe('0'); // To Do
    expect(values[2].text()).toBe('0'); // In Progress
    expect(values[3].text()).toBe('0'); // Done
  });

  it('calculates statistics correctly from a mixed projects array', () => {
    const projects = [
      { status: 'TODO' },
      { status: 'IN_PROGRESS' },
      { status: 'DONE' },
      { status: 'DONE' },
      { status: 'DONE' }
    ];
    const wrapper = mount(StatsBar, { props: { projects } });
    const values = wrapper.findAll('.stat-value');
    
    expect(values[0].text()).toBe('5'); // Total
    expect(values[1].text()).toBe('1'); // To Do
    expect(values[2].text()).toBe('1'); // In Progress
    expect(values[3].text()).toBe('3'); // Done
  });

});
