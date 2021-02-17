export default class Hero {
  constructor(component) {
    this.dom = {
      $component: component
    },
    this.state = {
    }
    this.mount();
  }

  mount() {
    console.log('Hero : mount', this);
  }

  unmount() {
    console.log('Hero : unmount', this);
  }

}