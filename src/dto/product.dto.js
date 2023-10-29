class ProductDTO {
    constructor(title, price, description, code, status, stock, category, thumbnails) {
      this.title = title;
      this.price = price;
      this.description = description;
      this.code = code;
      this.status = status;
      this.stock = stock;
      this.category = category;
      this.thumbnails = thumbnails;
    }
  }
  
  module.exports = ProductDTO;
  