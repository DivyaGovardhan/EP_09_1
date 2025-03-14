let eventBus = new Vue()



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

            <span>{{ sale }}</span>
            
            <div class="color-box"
                v-for="(variant, index) in variants"
                :key="variant.variantId"
                :style="{ backgroundColor:variant.variantColor }"
                @mouseover="updateProduct(index)">
            </div>

            <ul>
                <li v-for="size in sizes">{{ size }}</li>
            </ul>

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
        }
    },

    methods: {
        updateProduct(index){
            this.selectedVariant = index;
            console.log(index);
        },

        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },

        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        }
    },

    computed: {
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity > 0;
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



Vue.component('product-review', {
    template: `
        
        <form class="review-form" @submit.prevent="onSubmit">
            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
            </p>
            
            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>
            
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>
            
            <p>
                <legend>Would you recommend this product?</legend>
                
                <input type="radio" id="yes" value="yes" name="recommend" v-model="recommend" >
                <label for="yes">Yes</label>
                
                <input type="radio" id="no" value="no" name="recommend" v-model="recommend" >
                <label for="no">No</label>
            </p>
            
            <p>
                <input type="submit" value="Submit"> 
            </p>
            
            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>
        </form>
    `,

    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: [],
        }
    },

    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend,
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
                this.errors = [];
            } else {
                this.errors = [];
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommend) this.errors.push("Recommending required.")
            }
        }
    }
})



Vue.component('product-tabs', {
    template: `
    <div>
      <ul>
        <span class="tab"
              :class="{ activeTab: selectedTab === tab }"
              v-for="(tab, index) in tabs"
              @click="selectedTab = tab"
        >{{ tab }}</span>
      </ul>

      <div v-show="selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
          <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
            <p> Recommend: {{ review.recommend }}</p>
          </li>
        </ul>
      </div>

      <div v-show="selectedTab === 'Make a Review'">
        <product-review></product-review>
      </div>
      
      <div v-show="selectedTab === 'Shipping'">
        <p>Shipping: {{ shipping }}</p>
      </div>
      
      <div v-show="selectedTab === 'Details'">
            <product-details :details="details"></product-details>
      </div>
    </div>
  `,

    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping','Details'],
            selectedTab: 'Reviews',
        }
    },

    props: {
        premium: {
            type: Boolean,
            required: true,
        },

        details: {
            type: Array,
            required: true,
        },

        reviews: {
            type: Array,
            required: false
        }
    },

    methods: {
        addReview(productReview) {
            this.$emit('add-review', productReview);
        }
    },

    computed: {
        shipping() {
            return this.premium ? "Free" : 2.99;
        },
    },
})





let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        cart: [],
        reviews: [],
    },

    methods: {
        updateCart(id) {
            this.cart.push(id)
        },

        removeFromCart(id) {
            if(this.cart.length > 0){
                for (let i = 0; i < this.cart.length; i++) {
                    if (this.cart[i] === id) {
                        this.cart.splice(i, 1);
                        break;
                    }
                }
            }
        },

        addReview(productReview) {
            console.log('Adding review:', productReview);
            this.reviews.push(productReview);
        }
    },

    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }

})
