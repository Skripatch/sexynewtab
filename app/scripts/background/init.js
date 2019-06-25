'use strict';

;(() => {

	let thumbs,
		favicons,
		resolveBG;

	const ready = new Promise((res) => {
		resolveBG = res;
	});

	window.load = (callback) => {
		return ready;
	};

	function done () {
		resolveBG({
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
					settings.BACK_TYPE = res.settings.BACK_TYPE || settings.BACK_TYPE;
				}
				resolve();
			});
		});
	}

	function getLocal() {
		return new Promise((resolve) => {
			chrome.storage.local.get(['thumbs', 'favicons', 'background'], (res) => {
				thumbs = res.thumbs || {};
				favicons = res.favicons || {};
				settings.background = res.background;
				resolve();
			});
		});
	}

	Promise.all([
		getSync(),
		getLocal(),
	]).then(update)
		.then(() => {
			saveLocal();
			done();
		});

})();
