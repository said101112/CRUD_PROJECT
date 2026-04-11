import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProjectCreateView from '../ProjectCreateView.vue';
import api from '../../services/api';

// Mock de l'API
vi.mock('../../services/api', () => ({
  default: {
    createProject: vi.fn()
  }
}));

// Mock du router
const pushMock = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock })
}));

describe('ProjectCreateView.vue', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = mount(ProjectCreateView, { global: { stubs: ['ProjectForm'] } });
    expect(wrapper.find('h2').text()).toBe('Create New Project');
  });

  it('calls API and redirects on successful form submit', async () => {
    api.createProject.mockResolvedValue({});
    const wrapper = mount(ProjectCreateView, { global: { stubs: ['ProjectForm'] } });
    
    // Simulate emit from child ProjectForm
    await wrapper.findComponent({ name: 'ProjectForm' }).vm.$emit('submit', { title: 'New creation' });
    
    // Check if API was called
    expect(api.createProject).toHaveBeenCalledWith({ title: 'New creation' });
    
    // Wait for the async API resolve in the submit handler
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Checks if route pushed back
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('redirects safely on cancel', async () => {
    const wrapper = mount(ProjectCreateView, { global: { stubs: ['ProjectForm'] } });
    await wrapper.findComponent({ name: 'ProjectForm' }).vm.$emit('cancel');
    expect(pushMock).toHaveBeenCalledWith('/');
  });

});
