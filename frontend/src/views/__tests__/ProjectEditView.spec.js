import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProjectEditView from '../ProjectEditView.vue';
import api from '../../services/api';

// Mocks
vi.mock('../../services/api', () => ({
  default: {
    getProject: vi.fn(),
    updateProject: vi.fn()
  }
}));

const pushMock = vi.fn();
vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '1' } }),
  useRouter: () => ({ push: pushMock })
}));

describe('ProjectEditView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially, then loads project details', async () => {
    api.getProject.mockResolvedValue({ id: 1, title: 'Existing Proj' });
    
    const wrapper = mount(ProjectEditView, { global: { stubs: ['ProjectForm'] } });
    
    // Au montage c'est loading
    expect(wrapper.text()).toContain('Loading...');
    
    // Attendre la résolution de l'API getProject
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Le statut de chargement disparaît, ProjectForm apparaît
    expect(wrapper.text()).not.toContain('Loading...');
    expect(wrapper.findComponent({ name: 'ProjectForm' }).exists()).toBe(true);
  });

  it('updates project via api on form submit and redirects', async () => {
    api.getProject.mockResolvedValue({ id: 1, title: 'Proj' });
    api.updateProject.mockResolvedValue({});
    
    const wrapper = mount(ProjectEditView, { global: { stubs: ['ProjectForm'] } });
    await new Promise(resolve => setTimeout(resolve, 0)); // wait load
    
    await wrapper.findComponent({ name: 'ProjectForm' }).vm.$emit('submit', { title: 'Updated Proj' });
    
    expect(api.updateProject).toHaveBeenCalledWith('1', { title: 'Updated Proj' });
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('redirects on cancel', async () => {
    api.getProject.mockResolvedValue({});
    const wrapper = mount(ProjectEditView, { global: { stubs: ['ProjectForm'] } });
    await new Promise(resolve => setTimeout(resolve, 0)); // wait for load
    
    await wrapper.findComponent({ name: 'ProjectForm' }).vm.$emit('cancel');
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
