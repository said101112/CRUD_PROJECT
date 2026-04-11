import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomeView from '../HomeView.vue';
import api from '../../services/api';

vi.mock('../../services/api', () => ({
  default: {
    getProjects: vi.fn(),
    deleteProject: vi.fn(),
    updateStatus: vi.fn()
  }
}));

describe('HomeView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and displays projects on mount', async () => {
    api.getProjects.mockResolvedValue([
      { id: 1, title: 'Test 1', status: 'TODO' },
      { id: 2, title: 'Test 2', status: 'DONE' }
    ]);

    const wrapper = mount(HomeView, { global: { stubs: ['ProjectCard', 'StatsBar'] } });
    
    // Shows loading initially
    expect(wrapper.find('.spinner').exists()).toBe(true);

    // After async resolve
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Projects populated into child components
    const cards = wrapper.findAllComponents({ name: 'ProjectCard' });
    expect(cards.length).toBe(2);
    expect(api.getProjects).toHaveBeenCalledTimes(1);
  });

  it('shows error state if api fails to fetch projects', async () => {
    api.getProjects.mockRejectedValue(new Error('Network error'));
    
    const wrapper = mount(HomeView, { global: { stubs: ['ProjectCard', 'StatsBar'] } });
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(wrapper.find('.error').exists()).toBe(true);
    expect(wrapper.text()).toContain('Failed to load projects');
  });

  it('triggers api delete when delete event is fired from ProjectCard', async () => {
    // Mock the confirm dialog
    globalThis.confirm = vi.fn(() => true);
    api.getProjects.mockResolvedValue([{ id: 1, title: 'To trash' }]);
    api.deleteProject.mockResolvedValue(true);
    
    const wrapper = mount(HomeView, { global: { stubs: ['ProjectCard', 'StatsBar'] } });
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const card = wrapper.findComponent({ name: 'ProjectCard' });
    await card.vm.$emit('delete', 1);
    
    expect(globalThis.confirm).toHaveBeenCalled();
    expect(api.deleteProject).toHaveBeenCalledWith(1);
    
    await new Promise(resolve => setTimeout(resolve, 0));
    // Should be removed from DOM
    expect(wrapper.findAllComponents({ name: 'ProjectCard' }).length).toBe(0);
  });
});
