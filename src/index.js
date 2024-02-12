document.addEventListener("DOMContentLoaded", function () {
	fetch("./services.json")
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json()
		})
		.then(data => {
			const parentElement = document.querySelector(".tree");
			renderTree(data.services, parentElement);
		})
		.catch(error => console.error("Error fetching data:", error));
});

function createElement(data) {
	const { id, name, node, price, head } = data;

	const element = document.createElement(node > 0 ? "ul" : "li");
	element.classList.add(node > 0 ? "directory" : "sub-directory");

	if (head) {
		element.classList.add("hidden");
	}

	element.setAttribute("id", `${id}`);

	const priceText = node > 0 ? "" : ` (${price})`;
	const titleText = name + priceText;
	element.textContent = titleText;
	return element;
}

function renderTree(objectsArray, tree) {
	const groupedServices = objectsArray.reduce((acc, service) => {
		const { head } = service;
		const key = head ? head : 0;

		if (!acc.has(key)) {
			acc.set(key, []);
		}

		acc.get(key).push(service);
		return acc;
	}, new Map());

	groupedServices.forEach(servicesArr => {
		servicesArr = servicesArr.sort((a, b) => a.sorthead - b.sorthead);

		servicesArr.forEach((item) => {
			const element = createElement(item);

			if (!item.head) {
				tree.appendChild(element);
			} else {
				const parentElement = document.getElementById(item.head);
				parentElement.appendChild(element);
			}
		})
	})

	return;
}

document.querySelector(".tree").addEventListener("click", function (event) {
	const element = event.target;

	if (element.classList.contains("directory")) {
		toggleElement(element);
	}
});

function toggleElement(element) {
	element.classList.toggle("opened");

	const childs = Array.from(element.children);

	childs.forEach(child => {
		child.classList.toggle("hidden");
	});
}
