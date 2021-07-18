export default class Distillery {
  constructor(index, meta) {
    this.index = index;
    this.name = meta.name.toLowerCase().replace(' ', '-');
    this.region = meta.region.toLowerCase();
    this.meta = meta;

    const [input, label] = this.createLabel();
    this.input = input;
    this.label = label;
    this.block = this.createBlock();
  }

  createLabel() {
    const label = document.createElement('label');
    const input = document.createElement('input');
    const name = document.createElement('span');
    const owner = document.createElement('span');

    name.innerText = this.meta.visibleName;
    name.classList.add('name');

    owner.innerText = this.meta.visibleOwner;
    owner.classList.add('owner');

    input.type = 'checkbox';
    input.dataset.index = this.index;
    input.id = 'input-id-' + this.index;

    label.id = 'label-id-' + this.index;
    label.append(input, name, owner);

    return [input, label];
  }

  createBlock() {
    const block = document.createElement('span');

    block.dataset.index = this.index;
    block.dataset.name = this.meta.visibleName;
    block.dataset.region = this.meta.region;
    block.dataset.owner = this.meta.visibleOwner;

    block.classList.add('distillery');
    block.classList.add(this.region);

    block.id = 'block-id-' + this.index;

    block.addEventListener('mouseenter', createTooltip);
    block.addEventListener('mouseleave', removeTooltip);

    return block;
  }
}

function createTooltip(event) {
  const target = event.currentTarget;
  const tooltips = document.querySelectorAll('div.tooltip');

  for (const tooltip of tooltips) {
    tooltip.remove();
  }

  const tooltip = document.createElement('div');
  const container = document.createElement('div');
  const name = document.createElement('p');
  const owner = document.createElement('p');

  name.innerText = target.dataset.name;
  name.classList.add('name');

  owner.innerText = target.dataset.owner;
  owner.classList.add('owner');

  tooltip.classList.add('tooltip');
  tooltip.classList.add('up');

  tooltip.addEventListener('click', removeTooltip);

  container.append(name, owner);
  tooltip.append(container);
  target.after(tooltip);

  return tooltip;
}

function removeTooltip(event) {
  const target = (event.currentTarget.tagName == 'SPAN')
    ? event.currentTarget
    : event.currentTarget.previousSibling;
  const sibling = target.nextSibling;
  if (sibling.classList.contains('tooltip')
    && sibling.tagName == "DIV") {
    sibling.classList.add('down');
    sibling.offsetHeight;
    setTimeout(() => {
      sibling.remove();
    }, 200);
  }

  return true;
}
