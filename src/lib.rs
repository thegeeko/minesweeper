mod mslib;
mod utils;

use std::cell::RefCell;

use mslib::{Minesweeper, OpenResult};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

thread_local! {
	static GAME_SESSION:RefCell<Minesweeper> = RefCell::new(Minesweeper::new(10, 10, 25));
}

#[wasm_bindgen(js_name = restSession)]
pub fn reset_session(width: u32, height: u32, mines_count: u32) {
	GAME_SESSION.with(|g| {
		let mut session = g.borrow_mut();
		session.reset_session(width, height, mines_count);
	})
}

#[wasm_bindgen(js_name = getState)]
pub fn get_state() -> String {
	GAME_SESSION.with(|g| g.borrow().to_string())
}

#[wasm_bindgen(js_name = openField)]
pub fn open_field(x: u32, y: u32) -> bool {
	GAME_SESSION.with(|g| {
		let mut session = g.borrow_mut();
		match session.open((x, y)) {
			OpenResult::Mine => true,
			OpenResult::NoMine => false,
			OpenResult::Opened => false,
		}
	})
}

#[wasm_bindgen(js_name = toggleFlag)]
pub fn toggle_flag(x: u32, y: u32) {
	GAME_SESSION.with(|g| {
		let mut session = g.borrow_mut();
		session.toggle_flag((x, y));
	})
}
