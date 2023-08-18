const requestDataHandler = require('@services/requestDataHandler');
const axios = require('axios');

const authParams = {
  username: process.env.ERP_USER,
  password: process.env.ERP_PASSWORD,
};

module.exports = {
  async getProducts(changed) {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_products`, authParams, {}, { changed }, undefined);
    const response = await axios(data);
    try {
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      return err;
    }
  },

  async getCustomers(changed) {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_clients`, authParams, {}, { changed }, undefined);
    try {
      const response = await axios(data);
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async deleteObjectRegistration(paramData) {
    const data = requestDataHandler('DELETE', `${process.env.ERP_HOST}/object_registration`, authParams, {}, paramData, undefined);
    const response = await axios(data);
    try {
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      return err;
    }
  },

  async getAddProducts() {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_add_products`, authParams, {}, {}, undefined);
    const response = await axios(data);
    try {
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      return err;
    }
  },

  async getAddProductsToExchange() {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_add_products_changed`, authParams, {}, {}, undefined);
    const response = await axios(data);
    try {
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      return err;
    }
  },

  async getSalesOrderStatusesToExchange() {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_sales_order_statuses_changed`, authParams, {}, {}, undefined);
    const response = await axios(data);
    try {
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      return err;
    }
  },

  async getSalesOrdersToExchange() {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_sales_orders_changed`, authParams, {}, {}, undefined);
    const response = await axios(data);
    try {
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      return err;
    }
  },

  async getCurrenciesToExchange() {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_currencies_changed`, authParams, {}, {}, undefined);
    const response = await axios(data);
    try {
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      return err;
    }
  },

  async getCountriesToExchange() {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_countries_changed`, authParams, {}, {}, undefined);
    const response = await axios(data);
    try {
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      return err;
    }
  },

  async getTermsOfPaymentToExchange() {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_terms_of_payment_changed`, authParams, {}, {}, undefined);
    const response = await axios(data);
    try {
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      return err;
    }
  },

  async getAddProductPrices() {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_add_product_prices`, authParams, {}, undefined, undefined);
    const response = await axios(data);
    try {
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      return err;
    }
  },

  async getAddProductPricesToExchange() {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_add_product_prices_changed`, authParams, {}, undefined, undefined);
    const response = await axios(data);
    try {
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      return err;
    }
  },

  async getProductParameters(productUuid) {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_product_parameters`, authParams, {}, { product_uuid: productUuid }, undefined);
    try {
      const response = await axios(data);
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      throw err;
    }
  },

  async getProductParamSettings() {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_product_parameters_settings`, authParams, {}, {}, undefined);
    try {
      const response = await axios(data);
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      throw err;
    }
  },

  async getProductParameters(productUuid) {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_product_parameters`, authParams, {}, { product_uuid: productUuid }, undefined);
    try {
      const response = await axios(data);
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      throw err;
    }
  },
  async getParameterValues(productUuid, parameterUuid) {
    const data = requestDataHandler(
      'GET',
      `${process.env.ERP_HOST}/get_parameter_values`,
      authParams,
      {},
      { product_uuid: productUuid, parametr_uuid: parameterUuid },
      undefined
    );
    try {
      const response = await axios(data);
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      throw err;
    }
  },

  async getParameterValues(productUuid, parameterUuid) {
    const data = requestDataHandler(
      'GET',
      `${process.env.ERP_HOST}/get_parameter_values`,
      authParams,
      {},
      { product_uuid: productUuid, parametr_uuid: parameterUuid },
      undefined
    );
    try {
      const response = await axios(data);
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      throw err;
    }
  },

  async getParameterProperties(productUuid, parameterUuid) {
    const data = requestDataHandler(
      'GET',
      `${process.env.ERP_HOST}/get_parameter_properties`,
      authParams,
      {},
      { product_uuid: productUuid, parameter_uuid: parameterUuid },
      undefined
    );
    try {
      const response = await axios(data);
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      throw err;
    }
  },
  async getPropertyValues(propertyUuid) {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_property_values`, authParams, {}, { property_uuid: propertyUuid }, undefined);
    try {
      const response = await axios(data);
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  async getProductExpressionVariables(productUuid) {
    const data = requestDataHandler(
      'GET',
      `${process.env.ERP_HOST}/get_product_expression_variables`,
      authParams,
      {},
      { product_uuid: productUuid },
      undefined
    );
    try {
      const response = await axios(data);
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      //console.log(err);
      throw err;
    }
  },
  async getDependedPropertyValues(propertyUuid) {
    const data = requestDataHandler(
      'GET',
      `${process.env.ERP_HOST}/get_dependent_properties_values`,
      authParams,
      {},
      { property_uuid: propertyUuid },
      undefined
    );
    try {
      const response = await axios(data);
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  async getProductPricelist(productUuid) {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_product_pricelist`, authParams, {}, { product_uuid: productUuid }, undefined);
    try {
      const response = await axios(data);
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async getPricelist() {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_pricelist`, authParams, {}, {}, undefined);
    try {
      const response = await axios(data);
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async getProductsDiscount() {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_products_discounts`, authParams, {}, undefined, undefined);
    try {
      const response = await axios(data);
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  async getDiscounts() {
    const data = requestDataHandler('GET', `${process.env.ERP_HOST}/get_discounts`, authParams, {}, undefined, undefined);
    try {
      const response = await axios(data);
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
