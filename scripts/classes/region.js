export default class Region {
  constructor(index, meta) {
    this.index = index;
    this.name = meta.name;
    this.visibleName = meta.visibleName;
    this.region = meta.name.toLowerCase();
    this.count = {
      total: meta.count,
      owned: 0
    };
    this.countProxy = new Proxy(this.count, {
        set: (target, property, value, receiver) => {
          target[property] = value;
          this.section.counter.innerText = value;
          this.header.counter.innerText = value;
          this.header.graph.style.backgroundImage =
            `conic-gradient(
              rgba(255, 255, 255, 0.0) ${this.completeionPercentage}turn,
              rgba(255, 255, 255, 0.8) ${this.completeionPercentage}turn 1.0turn
            )`;
          return true;
        }
    });

    this.section = this.createSection();
    this.header = this.createHeader();

    this.countProxy.owned = 0;
  }

  get completeionPercentage() {
    return (this.count.owned / this.count.total).toFixed(2);
  }

  createSection() {
    const section = document.createElement('section');
    const header = document.createElement('header');
    const h3 = document.createElement('h3');
    const name = document.createElement('span');
    const counter = document.createElement('span');
    const total = document.createElement('span');
    const owned = document.createElement('span');
    const ul = document.createElement('ul');

    ul.style.display = 'none';

    name.innerText = this.visibleName;
    name.classList.add('name');

    counter.classList.add('counter');

    total.innerText = this.count.total;
    total.classList.add('total');

    owned.innerText = this.count.owned;
    owned.classList.add('owned');

    section.classList.add('region');
    section.classList.add(this.region);

    header.addEventListener('click', event => {
      const lists = document.querySelectorAll('#lists ul');
      for (const ul of lists) {
        ul.style.display = 'none';
      }
      event.currentTarget.nextSibling.style.display = null;
    });

    counter.append(owned, total);
    h3.append(counter, name);
    header.append(h3);
    section.append(header, ul);

    return { body: section, counter: owned };
  }

  createHeader() {
    const header = document.createElement('header');
    const h3 = document.createElement('h3');
    const name = document.createElement('span');
    const counter = document.createElement('span');
    const total = document.createElement('span');
    const owned = document.createElement('span');
    const graph = document.createElement('span');

    name.innerText = this.visibleName;
    name.classList.add('name');

    counter.classList.add('counter');

    total.innerText = this.count.total;
    total.classList.add('total');

    owned.innerText = this.count.owned;
    owned.classList.add('owned');

    graph.classList.add('graph');

    header.classList.add('header');
    header.classList.add(this.region);

    counter.append(owned, total);
    h3.append(graph, name, counter);
    header.append(h3);

    return { body: header, counter: owned, graph: graph };
  }
}
