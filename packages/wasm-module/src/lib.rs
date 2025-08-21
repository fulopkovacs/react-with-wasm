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

#[wasm_bindgen]
pub fn convert_to_grayscale(image_data: &[u8]) -> Vec<u8> {
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
    grayscale_data
}

// #[wasm_bindgen]
// pub fn convert_to_grayscale(image_data: &[u8]) -> Vec<u8> {
//     image_data.to_vec()
// }
