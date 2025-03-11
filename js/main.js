Vue.component('product', {
    template: `
    <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText">
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>

            <p v-if="inStock">In stock</p>
            <p v-else :class="{ underline: !inStock }">Out of Stock</p>

            <product-details :details="details"></product-details>

            <span>{{ sale }}</span>
            
            <p>Shipping: {{ shipping }}</p>
            
            <div class="color-box"
                v-for="(variant, index) in variants"
                :key="variant.variantId"
                :style="{ backgroundColor:variant.variantColor }"
                @mouseover="updateProduct(index)">
            </div>

            <ul v-for="size in sizes">
                <li>{{ size }}</li>
            </ul>

            <div class="cart">
                <p>Cart({{ cart }})</p>
            </div>
        </div>

        <button v-on:click="addToCart"
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }">
            Add to cart
        </button>

        <button v-on:click="removeFromCart">Remove from cart</button>

        <div class="product-link">
            <a :href="link">More products like this</a>
        </div>
    </div>
    `,

    props: {
        premium: {
            type: Boolean,
            required: true,
        },

        details: {
            type: Array,
            required: true,
        },
    },

    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            onSale: true,
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
        }
    },

    methods: {
        addToCart(){
            this.cart += 1
        },

        removeFromCart(){
            if(this.cart > 0){
                this.cart -= 1
            }
        },

        updateProduct(index){
            this.selectedVariant = index;
            console.log(index);
        }
    },

    computed: {
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },

        image() {
            return this.variants[this.selectedVariant].variantImage;
        },

        title() {
            return this.brand + ' ' + this.product;
        },

        sale() {
            return this.brand + ' ' + this.product + ': ' + (this.onSale ? 'on Sale' : 'not Sale');
        },

        shipping() {
            return this.premium ? "Free" : 2.99;
        },
    },
})

Vue.component('product-details', {
    template: `
    <div class="product-details">
        <ul>
            <li v-for="detail in details" :key="detail">{{ detail }}</li>
        </ul>
    </div>
    `,
    props: {
        details: {
            type: Array,
            required: true,
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: false,
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],
    },
})