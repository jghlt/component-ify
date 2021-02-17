import View from 'app/view';
import 'components/promo-banner';
import Hero from 'components/hero';

class Theme extends View {
  constructor() {
    super();
    this.dom = {
      $html: document.querySelector('html')
    }
    this.state = {
      components: {
        Hero
      },
      mounted: []
    };
    this.mount();
  }

  mount() {
    const {
      dom,
      state
    } = this;
    this.mountComponents();
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  new Theme();
});