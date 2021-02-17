export default class ComponentifyView {
  constructor() {
    this.state = {
      components: {},
      mounted: []
    };
  }

  mountComponents() {
    console.log('View : mountComponents', this);
    const { state } = this;
    const components = Array.from(document.querySelectorAll('[data-component]'));
    components.forEach((element, componentIndex) => {
      const componentClass = element.getAttribute('data-component');
      const componentMounted = element.getAttribute('data-mounted') || false;
      if (
        !componentMounted && 
        state.components[componentClass] &&
        typeof state.components[componentClass] === 'function'
      ) {
        state.mounted.push({
          id: `${componentIndex}`,
          element: element,
          mounted: true,
          instance: new state.components[componentClass](element)
        });
        element.setAttribute('data-mounted', true);
      }
    });
  }

  unmountComponents() {
    console.log('View : unmountComponents', this);
    const {state} = this;
    state.mounted.forEach((component, index) => {
      const shouldUnmount = this.componentShouldUnmount(component.element);
      if (
        shouldUnmount && 
        component.instance && 
        component.mounted === true &&
        typeof component.instance.unmount === 'function'
      ) {
        component.instance.unmount();
        component.mounted = false
      }
    });
  }

  componentShouldUnmount(element) {
    return !document.documentElement.contains(element);
  }
}