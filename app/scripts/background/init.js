'use strict';

;(() => {

	let thumbs,
		favicons,
		resolve;

	const ready = new Promise((res) => {
		resolve = res;
	});

	window.load = (callback) => {
		return ready;
	};

	function done () {
		resolve({
			slotsList,
			settings,
			swap,
			editPage
		});
	}

	function update() {
		return Promise.all(
			slotsList.map((slot) => {
				if (slot && slot.url) {
					slot.thumb = thumbs[slot.url];
					slot.favicon = favicons[slot.url];
					// update favicon not more often than 24h
					if (slot.favicon && (Date.now() - slot.favicon.lastUpdate < 24 * 60 * 60000)) { return; }
					return updateFavicon(slot);
				}
			})
		);
	}

	function getSync() {
		return new Promise((resolve) => {
			chrome.storage.sync.get(['slots', 'settings'], (res) => {
				if (res.slots && res.slots.length){
					slotsList = res.slots;
				}
				if (res.settings) {
					settings.COLUMNS_COUNT = res.settings.COLUMNS_COUNT;
					settings.ROWS_COUNT = res.settings.ROWS_COUNT;
					settings.FLOW = res.settings.FLOW;
					settings.THEME = res.settings.THEME;
					settings.BACK = res.settings.BACK;
				}
				resolve();
			});
		});
	}

	function getLocal() {
		return new Promise((resolve) => {
			chrome.storage.local.get(['thumbs', 'favicons'], (res) => {
				thumbs = res.thumbs || {};
				favicons = res.favicons || {};
				resolve();
			});
		});
	}

	function init() {
		Promise.all([
			getSync(),
			getLocal(),
		]).then(update)
			.then(() => {
				saveLocal();
				done();
			});

	}

	init();

})();
