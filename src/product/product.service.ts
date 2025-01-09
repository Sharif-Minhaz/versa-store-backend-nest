import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  getAllProducts() {
    return { success: true };
  }

  getProductById(id: string) {
    return { success: true, message: `This action returns a #${id} product` };
  }

  getProductsByCategory(id: string) {
    return `This action returns products from category #${id}`;
  }

  getVendorProducts(name: string) {
    return `This action returns products from vendor ${name}`;
  }

  addProduct() {
    return 'This action adds a new product';
  }

  updateProduct() {
    return 'This action updates a #product';
  }

  deleteProduct() {
    return 'This action removes a #product';
  }

  deleteProductImage() {
    return 'This action removes a #product image';
  }

  bookmarkToggleProduct() {
    return 'This action bookmark or unbookmark a #product';
  }

  searchProduct() {
    return 'This action searches for a #product';
  }
}
