// Problem Statement
// Create a type for a Product with the following properties:

// name (a string)
// price (a number)
// Create another type for DigitalProduct with the following properties:

// downloadLink (a string)
// Combine these two types into a new type FullProduct to represent a product that can either be digital or physical. Create an object of type FullProduct and print its details.
// Example Input:

type Product = {
  name: String;
  price: number;
};

type DigitalProduct = {
  downloadLink: String;
};

type FullProduct = Product & DigitalProduct;

export const fullProduct: FullProduct = {
  name: "E-book",
  price: 10,
  downloadLink: "https://example.com/ebook",
};
console.log(fullProduct);

// Example Output:

// {
//     name: 'E-book',
//     price: 10,
//     downloadLink: 'https://example.com/ebook'
// }
