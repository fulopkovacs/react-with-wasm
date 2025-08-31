use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
pub fn get_arr_length(arr: &[f32]) -> usize {
    arr.len()
}

// pub fn convert_to_grayscale(ptr: u8, size: usize) -> *const u8 {
//     let image_data: &[u8] = unsafe { std::slice::from_raw_parts(&ptr as *const u8, size) }; // Assuming max size of 1MB RGBA image
#[wasm_bindgen]
pub fn convert_to_grayscale(ptr: *const u8, size: usize) -> *const u8 {
    let image_data = unsafe { std::slice::from_raw_parts(ptr, size) };
    let mut grayscale_data = Vec::with_capacity(image_data.len() / 4);
    for chunk in image_data.chunks(4) {
        let r = chunk[0] as f32;
        let g = chunk[1] as f32;
        let b = chunk[2] as f32;
        let a = chunk[3];
        let gray = (0.299 * r + 0.587 * g + 0.114 * b) as u8;
        grayscale_data.push(gray); // r
        grayscale_data.push(gray); // g
        grayscale_data.push(gray); // b
        grayscale_data.push(a);
    }

    &grayscale_data[0] as *const u8
}

// #[wasm_bindgen]
// pub fn convert_to_grayscale(image_data: &[u8]) -> Vec<u8> {
//     image_data.to_vec()
// }

// https://docs.rs/console_error_panic_hook/latest/console_error_panic_hook/
// TODO: check if we should call alloc
// #[wasm_bindgen]
// pub fn allocate_memory(size: usize) -> *const u8 {
//     &Vec::with_capacity(size)[0] as *const u8

#[wasm_bindgen]
pub extern "C" fn alloc(size: usize) -> *mut u8 {
    let mut buf = Vec::with_capacity(size);
    let ptr = buf.as_mut_ptr();
    std::mem::forget(buf); // take ownership of memory block
    ptr
}

#[wasm_bindgen]
pub unsafe extern "C" fn dealloc(ptr: *mut u8, size: usize) {
    let align = std::mem::align_of::<usize>();
    let layout = std::alloc::Layout::from_size_align_unchecked(size, align);
    std::alloc::dealloc(ptr, layout);
}
