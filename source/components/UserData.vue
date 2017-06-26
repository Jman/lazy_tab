<template>
    <form action="/" id="form">
        <fieldset>
            <legend>User Info</legend>
            <ul class="form-list">
                <li class="field">
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" v-model="form.email">
                    <input type="hidden" name="username" v-model="form.email">
                </li>
                <li class="field">
                    <label for="password">Password</label>
                    <input name="password" id="password" v-model="form.password">
                    <input type="hidden" name="confirm" v-model="form.password">
                </li>
                <li class="field">
                    <label for="firstname">Firstname</label>
                    <input name="firstname" id="firstname" v-model="form.firstname">
                </li>
                <li class="field">
                    <label for="lastname">Lastname</label>
                    <input name="lastname" id="lastname" v-model="form.lastname">
                </li>
                <li class="field">
                    <label for="telephone">Telephone</label>
                    <input name="telephone" id="telephone" v-model="form.telephone">
                </li>
            </ul>
        </fieldset>
        <fieldset>
            <legend>Billing Address</legend>
            <ul class="form-list">
                <li class="field">
                    <label for="street">Street</label>
                    <input name="street" id="street" v-model="form.street" />
                </li>
                <li class="field">
                    <label for="city">City</label>
                    <input name="city" id="city" v-model="form.city" />
                </li>
                <li class="field">
                    <label for="country_id">Country</label>
                    <input name="country_id" id="country_id" v-model="form.country_id" />
                    <span class="hint">should be shortcode</span>
                </li>
                <li class="field">
                    <label for="region_id">State</label>
                    <input name="region_id" id="region_id" v-model="form.region_id" />
                    <span class="hint">can be integer id or string name of state</span>
                </li>
                <li class="field">
                    <label for="postcode">Postcode</label>
                    <input name="postcode" id="postcode" v-model="form.postcode" />
                </li>
            </ul>
        </fieldset>
        <fieldset>
            <legend>Shipping Address</legend>
            <ul class="form-list">
                <li class="field">
                    <label for="shipping_firstname">Firstname</label>
                    <input name="shipping[firstname]" id="shipping_firstname" v-model="form['shipping[firstname]']" />
                </li>
                <li class="field">
                    <label for="shipping_lastname">Lastname</label>
                    <input name="shipping[lastname]" id="shipping_lastname" v-model="form['shipping[lastname]']" />
                </li>
                <li class="field">
                    <label for="shipping_email">Email</label>
                    <input type="email" name="shipping[email]" id="shipping_email" v-model="form['shipping[email]']" />
                </li>
                <li class="field">
                    <label for="shipping_telephone">Telephone</label>
                    <input name="shipping[telephone]" id="shipping_telephone" v-model="form['shipping[telephone]']" />
                </li>
                <li class="field">
                    <label for="shipping_street">Street</label>
                    <input name="shipping[street][]" id="shipping_street" v-model="form['shipping[street][]']" />
                </li>
                <li class="field">
                    <label for="shipping_city">City</label>
                    <input name="shipping[city]" id="shipping_city" v-model="form['shipping[city]']" />
                </li>
                <li class="field">
                    <label for="shipping_country_id">Country</label>
                    <input name="shipping[country_id]" id="shipping_country_id" v-model="form['shipping[country_id]']" />
                    <span class="hint">should be shortcode</span>
                </li>
                <li class="field">
                    <label for="shipping_region_id">State</label>
                    <input name="shipping[region_id]" id="shipping_region_id" v-model="form['shipping[region_id]']" />
                    <span class="hint">can be integer id or string name of state</span>
                </li>
                <li class="field">
                    <label for="shipping_postcode">Postcode</label>
                    <input name="shipping[postcode]" id="shipping_postcode" v-model="form['shipping[postcode]']" />
                </li>
            </ul>
        </fieldset>
        <fieldset>
            <legend>Payment Info</legend>
            <ul class="form-list">
                <li class="field">
                    <label for="cc_owner">Owner Name</label>
                    <input name="cc_owner" id="cc_owner" v-model="form.cc_owner" />
                </li>
                <li class="field">
                    <label for="cc_number">Card Number</label>
                    <input name="cc_number" id="cc_number" v-model="form.cc_number" />
                </li>
                <li class="field">
                    <label for="cc_type">Card Type</label>
                    <select name="cc_type" id="cc_type" v-model="form.cc_type">
                        <option></option>
                        <option value="Visa">Visa</option>
                        <option value="Master Card">Master Card</option>
                    </select>
                </li>
                <li class="field">
                    <label for="cc_exp_month">Exp. Month</label>
                    <input name="cc_exp_month" id="cc_exp_month" v-model="form.cc_exp_month" />
                </li>
                <li class="field">
                    <label for="cc_exp_year">Exp. Year</label>
                    <input name="cc_exp_year" id="cc_exp_year" v-model="form.cc_exp_year" />
                </li>
                <li class="field">
                    <label for="cc_cid">CVV</label>
                    <input name="cc_cid" id="cc_cid" v-model="form.cc_cid" />
                </li>
            </ul>
        </fieldset>
        <div class="form-actions">
            <button @click.prevent="resetForm">Use Default</button>
            <button @click.prevent="saveForm">Submit</button>
        </div>
    </form>
</template>

<script>
  export default {
    props: ['form', 'index'],
    methods: {

      resetForm(){
        if(!localStorage.users) { return; }
        let localData = JSON.parse(localStorage.users);
        if(localData.length === 1){
          localStorage.removeItem('users');
        } else {
          localData[this.index] = {};
          localStorage.users = JSON.stringify(localData);
        }
        this.$emit('updateUser');
      },

      saveForm(){
        let localData = localStorage.users ? JSON.parse(localStorage.users) : [];
        localData[this.index] = localData[this.index] || {};
        Object.assign(localData[this.index], this.form);
        localStorage.setItem('users', JSON.stringify(localData));
        this.$emit('updateUser');
      }

    }
  }
</script>