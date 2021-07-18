import * as parseHash from './hash.js';
import Region from './classes/region.js';
import Distillery from './classes/distillery.js';
import I18n from './classes/i18n.js';

function getLang() {
  //return 'ko';
  return navigator.language.split('-')[0];
}

function initialize(data, lang) {
  const i18n = new I18n(lang, getLang());

  data.distilleries.sort((a, b) => i18n.get(a.name).localeCompare(i18n.get(b.name)));

  distilleries.length = data.distilleries.length;
  distilleries.fill(false);

  const visualisation = document.getElementById('visualisation');
  const lists = document.getElementById('lists');

  for (const distilleryData of data.distilleries) {
    const region = distilleryData.region;

    // for regions
    if (!regions[region]) {
      const count = data.distilleries.reduce((counter, el) => {
        return counter + 1*(el.region == region);
      }, 0);
      
      const keys = Object.keys(regions);
      const length = keys.length;

      let before;

      // find the pos after the first region
      if (length >= 1) {
        // first create and sort the array
        const arr = [];
        for (const region in regions) {
          arr.push([ regions[region].count.total, region ]);
        }
        arr.sort((a, b) => b[0] - a[0]);
        // find the pos by count then insert
        const pos = arr.findIndex(el => el[0] < count);

        if (pos >= 0) {
          const key = arr[pos][1];
          before = regions[key];
        }
      }

      regions[region] = new Region(length, {
        name: region,
        visibleName: i18n.get(region),
        count: count
      });

      const section = regions[region].section.body;
      const header = regions[region].header.body;

      if (before) {
        before.section.body.before(section);
        before.header.body.before(header);
      } else {
        lists.append(section);
        visualisation.append(header);
      }
    }

    const index = distilleryData.index;
    //if (distilleryData.open > 2017) continue;

    distilleryData.visibleName = i18n.get(distilleryData.name);
    distilleryData.visibleOwner = i18n.get(distilleryData.owner);

    const distillery = new Distillery(index, distilleryData);
    const input = distillery.input;
    const label = distillery.label;
    const block = distillery.block;

    // for labels
    const ul = regions[region].section.body.getElementsByTagName('ul')[0];
    const li = document.createElement('li');

    input.addEventListener('change', onChange);

    li.append(label);
    ul.append(li);

    // for blocks
    let before = visualisation.querySelectorAll(`span.distillery.${distillery.region}`);

    if (before.length == 0) {
      before = visualisation.querySelector(`.header.${distillery.region}`);
    } else {
      before = before[before.length-1];
    }

    block.addEventListener('click', onChange);

    before.after(block);
  }

  lists.querySelector('.region ul').style.display = 'block';

  const getHash = () => {
    const hash = parseHash.getHash();
    if (hash.length > 0) {
      try {
        const arr = parseHash.numToArr(hash, data.distilleries.length);
        for (const [index, value] of arr.entries()) {
          if (value) distilleriesProxy[index] = value;
        }
      } catch(err) {
        console.error(err);
      }
    }
  };

  getHash();

  window.addEventListener('hashchange', () => {
    //getHash();
    console.log(window.location.hash);
  }, false);
  window.initialized = true;
}

function onChange(event) {
  const target = event.currentTarget;
  const index = target.dataset.index;
  event.preventDefault();
  distilleriesProxy[index] = !distilleriesProxy[index];
}

window.initialized = false;

const regions = {};

const distilleries = [];
const distilleriesProxy = new Proxy(distilleries, {
  apply: (target, thisArg, args) => thisArg[target].apply(this, args),
  set: (target, property, value, receiver) => {
    //console.log('Set %s to %o', property, value);

    const input = document.getElementById('input-id-' + property);
    const label = document.getElementById('label-id-' + property);
    const block = document.getElementById('block-id-' + property);
    const region = block.dataset.region;

    target[property] = value;
    input.checked = value;

    if (input.checked) {
      label.classList.add('checked');
      block.classList.add('checked');
      regions[region].countProxy.owned++;
    } else {
      label.classList.remove('checked');
      block.classList.remove('checked');
      regions[region].countProxy.owned--;
    }

    if (window.initialized) setHash();
    return true;
  }
});

const setHash = () => {
  const num = parseHash.arrToNum(distilleries);
  parseHash.setHash(num);
};

// On DOM ready
document.addEventListener('DOMContentLoaded', event => {
  const distilleries = fetch('./data/distilleries.json').then(res => res.json());
  const lang = fetch('./data/lang.json').then(res => res.json());

  const data = Promise.all([distilleries, lang])
    .then(res => {
      const [ distilleries, lang ] = res;
      initialize(distilleries, lang);
    });
});
