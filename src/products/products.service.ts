import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel} from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from "./products.model";

@Injectable()
export class ProductsService {
    private products: Product[] = [];

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {

    }

    async insertProduct(title: string, desc: string, price: number) {
        const newProduct = new this.productModel({
            title: title, 
            description: 
            desc, 
            price: price
        });
        const result = await newProduct.save().then();
        return result.id as string;
    }

        async getProducts() {
            const products = await this.productModel.find().exec();
            return products.map((prod) => ({
                id: prod.id, 
                title: prod.title, 
                description:prod.description, 
                price: prod.price
            })
            );
        }

    async getSingleProduct(prodId: string) {
        const product = await this.findProduct(prodId);
        return { 
            id: product.id, 
            title: product.title, 
            description: product.description, 
            price: product.price
        };
    }

    async updateProduct(productId: string, title: string, description: string, price: number) {
        const updateProduct = await this.findProduct(productId);
        if(title) {
            updateProduct.title = title;
        }
        if(description) {
            updateProduct.description = description;
        }
        if(price) {
            updateProduct.price = price;
        }
        updateProduct.save();

    }

    async deleteProduct(prodId: string) {
        const result = await this.productModel.deleteOne({_id: prodId}).exec();
        if(result.n === 0) {
            throw new NotFoundException('Could not find product!');
        }

    }

    private async findProduct(id: string): Promise<Product> {
        let product;
        try{
            product = await this.productModel.findById(id);
        } catch (error) {
            throw new NotFoundException('Could not find product!');
        }
        return product;
    }

}