import pool from "../config/db.js";

async function insertProducts() {
    try {
        const products = [
            {
                product_name: "Black T-shirt",
                category_id: 1,
                brand: "Nike",
                weight: "500gm",
                gender: "Men",
                size: "L",
                color: "Black",
                description: "Premium cotton black t-shirt",
                tag_number: "TAG001",
                stock: 486,
                tag: "New",
                price: 80,
                tax: 8,
                image: "black-tshirt.jpg",
                status: "active"
            },
            {
                product_name: "Olive Green Leather Bag",
                category_id: 2,
                brand: "Gucci",
                weight: "900gm",
                gender: "Women",
                size: "Medium",
                color: "Olive Green",
                description: "Premium leather handbag",
                tag_number: "TAG002",
                stock: 734,
                tag: "Trending",
                price: 136,
                tax: 14,
                image: "olive-bag.jpg",
                status: "active"
            },
            {
                product_name: "Women Gold Dress",
                category_id: 1,
                brand: "Zara",
                weight: "700gm",
                gender: "Women",
                size: "M",
                color: "Gold",
                description: "Elegant women gold dress",
                tag_number: "TAG003",
                stock: 769,
                tag: "Best Seller",
                price: 215,
                tax: 22,
                image: "gold-dress.jpg",
                status: "active"
            },
            {
                product_name: "Gray Cap For Men",
                category_id: 3,
                brand: "Puma",
                weight: "200gm",
                gender: "Men",
                size: "Free Size",
                color: "Gray",
                description: "Comfortable gray cap",
                tag_number: "TAG004",
                stock: 371,
                tag: "New",
                price: 76,
                tax: 8,
                image: "gray-cap.jpg",
                status: "active"
            },
            {
                product_name: "Dark Green Cargo Pant",
                category_id: 1,
                brand: "Levis",
                weight: "750gm",
                gender: "Men",
                size: "32",
                color: "Dark Green",
                description: "Stylish cargo pant",
                tag_number: "TAG005",
                stock: 241,
                tag: "Popular",
                price: 110,
                tax: 11,
                image: "cargo-pant.jpg",
                status: "active"
            },
            {
                product_name: "Orange Multi Color Headphone",
                category_id: 4,
                brand: "Sony",
                weight: "350gm",
                gender: "Unisex",
                size: "Standard",
                color: "Orange",
                description: "Wireless Bluetooth headphone",
                tag_number: "TAG006",
                stock: 821,
                tag: "Hot",
                price: 231,
                tax: 23,
                image: "headphone.jpg",
                status: "active"
            },
            {
                product_name: "Kid's Yellow Shoes",
                category_id: 5,
                brand: "Adidas",
                weight: "450gm",
                gender: "Kids",
                size: "30",
                color: "Yellow",
                description: "Comfortable kids shoes",
                tag_number: "TAG007",
                stock: 321,
                tag: "New",
                price: 89,
                tax: 9,
                image: "kids-shoes.jpg",
                status: "active"
            },
            {
                product_name: "Men Dark Brown Wallet",
                category_id: 6,
                brand: "Woodland",
                weight: "180gm",
                gender: "Men",
                size: "Standard",
                color: "Brown",
                description: "Genuine leather wallet",
                tag_number: "TAG008",
                stock: 190,
                tag: "Premium",
                price: 132,
                tax: 13,
                image: "wallet.jpg",
                status: "active"
            },
            {
                product_name: "Sky Blue Sunglass",
                category_id: 7,
                brand: "RayBan",
                weight: "150gm",
                gender: "Unisex",
                size: "Standard",
                color: "Sky Blue",
                description: "Stylish sunglasses",
                tag_number: "TAG009",
                stock: 784,
                tag: "Trending",
                price: 77,
                tax: 8,
                image: "sunglass.jpg",
                status: "active"
            },
            {
                product_name: "Kid's Yellow T-shirt",
                category_id: 1,
                brand: "Nike",
                weight: "300gm",
                gender: "Kids",
                size: "S",
                color: "Yellow",
                description: "Soft cotton t-shirt",
                tag_number: "TAG010",
                stock: 650,
                tag: "New",
                price: 110,
                tax: 11,
                image: "kids-tshirt.jpg",
                status: "active"
            },
            {
                product_name: "White Rubber Band Smart Watch",
                category_id: 4,
                brand: "Apple",
                weight: "250gm",
                gender: "Unisex",
                size: "Standard",
                color: "White",
                description: "Smart fitness watch",
                tag_number: "TAG011",
                stock: 931,
                tag: "Featured",
                price: 77,
                tax: 8,
                image: "smartwatch.jpg",
                status: "active"
            },
            {
                product_name: "Men Brown Leather Shoes",
                category_id: 5,
                brand: "Bata",
                weight: "850gm",
                gender: "Men",
                size: "42",
                color: "Brown",
                description: "Formal leather shoes",
                tag_number: "TAG012",
                stock: 176,
                tag: "Premium",
                price: 222,
                tax: 22,
                image: "leather-shoes.jpg",
                status: "active"
            }
        ];

        for (const product of products) {
            await pool.query(
                `INSERT INTO products
                (product_name, category_id, brand, weight, gender, size, color,
                description, tag_number, stock, tag, price, tax, image, status)
                VALUES
                ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
                [
                    product.product_name,
                    product.category_id,
                    product.brand,
                    product.weight,
                    product.gender,
                    product.size,
                    product.color,
                    product.description,
                    product.tag_number,
                    product.stock,
                    product.tag,
                    product.price,
                    product.tax,
                    product.image,
                    product.status
                ]
            );
        }

        console.log("Products inserted successfully");

    } catch (error) {
        console.error(
            "Error inserting products:",
            error.message
        );

    } finally {
        process.exit();
    }
}

insertProducts();
