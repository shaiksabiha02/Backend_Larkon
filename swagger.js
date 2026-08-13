import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger-output.json";

const endpointsFiles = [
    "./server.js"
];

const doc = {
    info: {
        title: "Larkon Backend API",
        description: "API documentation for Larkon Backend",
        version: "1.0.0"
    },

    host: "localhost:3000",

    schemes: ["http"],

    tags: [
        {
            name: "Products",
            description: "Product APIs"
        },
        {
            name: "Categories",
            description: "Category APIs"
        },
        {
            name: "Reviews",
            description: "Review APIs"
        },
        {
            name: "Coupons",
            description: "Coupon APIs"
        },
        {
            name: "Orders",
            description: "Order APIs"
        },
        {
            name: "Customers",
            description: "Customer APIs"
        },
        {
            name: "Dashboard",
            description: "Dashboard Analytics APIs"
        },
        {
            name: "Authentication",
            description: "Authentication APIs"
        }
    ]
};

swaggerAutogen()(outputFile, endpointsFiles, doc);