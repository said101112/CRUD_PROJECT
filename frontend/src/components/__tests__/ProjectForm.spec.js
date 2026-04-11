import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import ProjectForm from '../ProjectForm.vue';

// Mock de useRouter
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() })
}));

describe('ProjectForm.vue', () => {
  
  it('renders creation form button by default', () => {
    const wrapper = mount(ProjectForm, { props: { isEditing: false } });
    expect(wrapper.find('button[type="submit"]').text()).toContain('Create Project');
    expect(wrapper.find('#progress').exists()).toBe(false); // Champ progress n'est pas présent en création
  });

  it('renders editing form correctly using initialData', async () => {
    const initialData = { title: 'Project Existing', progress: 50 };
    const wrapper = mount(ProjectForm, { props: { isEditing: true, initialData } });
    
    await wrapper.vm.$nextTick(); // On attend que Vue injecte les valeurs après le hook onMounted

    expect(wrapper.find('button[type="submit"]').text()).toContain('Update Project');
    expect(wrapper.find('#progress').exists()).toBe(true);
    expect(wrapper.find('#title').element.value).toBe('Project Existing');
  });

  it('emits "submit" event with sanitized and valid payload via Zod', async () => {
    const wrapper = mount(ProjectForm, { props: { isEditing: false } });
    
    await wrapper.find('#title').setValue('New Web App');
    await wrapper.find('#description').setValue('Developing a test');
    await wrapper.find('#created_by').setValue('Test Runner');
    
    // On soumet
    await wrapper.find('form').trigger('submit.prevent');
    
    // Attendre que la promesse ou validateur se resolvent en local
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('submit')[0][0]).toMatchObject({
      title: 'New Web App',
      description: 'Developing a test',
      created_by: 'Test Runner',
      priority: 'MEDIUM', // Valeur de ref() par défaut
      progress: 0
    });
  });

  it('displays error messages when schema validation fails', async () => {
    const wrapper = mount(ProjectForm, { props: { isEditing: false } });
    
    // On oublie volontairement le Title, on met juste la description
    await wrapper.find('#description').setValue('Desc sans title');
    await wrapper.find('#created_by').setValue('Test Runner');
    
    await wrapper.find('form').trigger('submit.prevent');
    await wrapper.vm.$nextTick();
    
    expect(wrapper.emitted('submit')).toBeFalsy(); // Rien ne doit être émis si Zod échoue
    
    // On doit avoir des phrases d'erreur dans le DOM
    const errorHTML = wrapper.html();
    expect(errorHTML).toContain('Title is required');
  });

  it('emits "cancel" event when cancel button is clicked', async () => {
    const wrapper = mount(ProjectForm);
    await wrapper.findAll('button[type="button"]')[0].trigger('click'); // Le bouton Cancel est un type="button"
    expect(wrapper.emitted('cancel')).toBeTruthy();
  });
});
