import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import ProjectCard from '../ProjectCard.vue';

const mockRouter = { push: vi.fn() };
vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}));

describe('ProjectCard.vue', () => {
  const project = { id: 2, title: 'Vitest Test Card', description: 'Testing Vue', status: 'TODO', priority: 'HIGH', created_by: 'QA Admin' };

  it('renders project data correctly', () => {
    const wrapper = mount(ProjectCard, { props: { project } });
    expect(wrapper.text()).toContain('Vitest Test Card');
    expect(wrapper.text()).toContain('Testing Vue');
    expect(wrapper.text()).toContain('QA Admin');
  });

  it('emits delete event when the trash button is clicked', async () => {
    const wrapper = mount(ProjectCard, { props: { project } });
    await wrapper.find('button.delete').trigger('click');
    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete')[0]).toEqual([2]); // Argument is project id
  });

  it('navigates to edit route via vue-router when the edit button is clicked', async () => {
    const wrapper = mount(ProjectCard, { props: { project } });
    await wrapper.find('button.edit').trigger('click');
    expect(mockRouter.push).toHaveBeenCalledWith('/projects/2/edit');
  });

  it('emits status-change iterating to IN_PROGRESS when status badge is clicked and state was TODO', async () => {
    const wrapper = mount(ProjectCard, { props: { project } });
    const statusBadge = wrapper.findComponent({ name: 'StatusBadge' });
    
    await statusBadge.trigger('click');
    expect(wrapper.emitted('status-change')).toBeTruthy();
    expect(wrapper.emitted('status-change')[0]).toEqual([2, 'IN_PROGRESS']);
  });
});
