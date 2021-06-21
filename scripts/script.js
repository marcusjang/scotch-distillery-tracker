function initialize() {
	const res = this.responseText;
	const data = JSON.parse(res);
	
	const visualisation = document.getElementById('visualisation');
	const lists = document.getElementById('lists');


	for (const [index, region] of data.regions.entries()) {
		{
			const section = document.createElement('section');
			const header = document.createElement('h3');
			const text = document.createElement('span');
			const ul = document.createElement('ul');

			if (index > 0) ul.style.display = 'none';

			text.innerText = region;

			section.classList.add('region');
			section.classList.add(region.toLowerCase());

			header.addEventListener('click', event => {
				const lists = document.querySelectorAll('#lists ul');
				for (const ul of lists) {
					ul.style.display = 'none';
				}
				event.currentTarget.nextSibling.style.display = null;
			});

			header.append(text);
			section.append(header, ul);
			lists.append(section);
		}
		{
			const header = document.createElement('h3');
			header.innerText = region;
			header.classList.add(region.toLowerCase());

			visualisation.append(header);
		}
	}

	data.distilleries.sort((a, b) => {
		if (a.name < b.name) return -1;
		if (a.name > b.name) return 1;
		return 0;
	});

	for (const [index, distillery] of data.distilleries.entries()) {
		const region = distillery.region.toLowerCase();
		const [input, label] = (() => {
			const ul = lists.querySelector(`.region.${region} ul`)

			const li = document.createElement('li');
			const label = document.createElement('label');
			const input = document.createElement('input');
			const name = document.createElement('span');
			const owner = document.createElement('span');

			name.innerText = distillery.name;
			name.classList.add('name');

			owner.innerText = distillery.owner;
			owner.classList.add('owner');

			input.type = 'checkbox';
			input.dataset.index = index;

			label.append(input, name, owner);
			li.append(label);
			ul.append(li);

			return [input, label];
		})();

		const block = (() => {
			const block = document.createElement('span');

			block.dataset.index = index;
			block.dataset.name = distillery.name;
			block.dataset.region = distillery.region;
			block.dataset.owner = distillery.owner;

			block.classList.add('distillery');
			block.classList.add(region);

			block.addEventListener('mouseenter', event => {
				const target = event.currentTarget;
				const tooltips = document.querySelectorAll('div.tooltip');

				for (const tooltip of tooltips) {
					tooltip.remove();
				}

				const tooltip = document.createElement('div');
				const container = document.createElement('div');
				const name = document.createElement('p');
				const owner = document.createElement('p');

				name.innerText = block.dataset.name;
				name.classList.add('name');

				owner.innerText = block.dataset.owner;
				owner.classList.add('owner');

				tooltip.classList.add('tooltip');
				tooltip.classList.add('up');

				container.append(name, owner);
				tooltip.append(container);
				target.after(tooltip);
			});

			block.addEventListener('mouseleave', event => {
				const sibling = event.currentTarget.nextSibling;
				if (sibling.classList.contains('tooltip')
					&& sibling.tagName == "DIV") {
					sibling.classList.add('down');
					sibling.offsetHeight;
					setTimeout(() => {
						sibling.remove();
					}, 200);
				}
			});

			let before = visualisation.querySelectorAll(`span.distillery.${region}`);

			if (before.length == 0) {
				before = visualisation.querySelector(`h3.${region}`);
			} else {
				before = before[before.length-1];
			}

			before.after(block);

			return block;
		})();

		const change = event => {
			if (event.currentTarget.tagName == 'SPAN') {
				input.checked = input.checked ? false : true;
			}
			if (input.checked) {
				label.classList.add('checked');
				block.classList.add('checked');
			} else {
				label.classList.remove('checked');
				block.classList.remove('checked');
			}
		};

		input.addEventListener('change', change);
		block.addEventListener('click', change);
	}
}

// On DOM ready
document.addEventListener('DOMContentLoaded', event => {
	const req = new XMLHttpRequest();
	req.addEventListener('load', initialize);
	req.open('GET', '/data/distilleries.json');
	req.send();
});