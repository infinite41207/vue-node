const requestDataHandler = require('@services/requestDataHandler');

const axios = require('axios');

const authParams = {
  username: process.env.OknoERP_USER,
  password: process.env.OknoERP_PASSWORD,
};

module.exports = {
  async getCustomers() {
    const data = requestDataHandler('GET', `${process.env.OknoERP_HOST}/getcustomers`, authParams, {});
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

  async getCustomersChanges() {
    const data = requestDataHandler('GET', `${process.env.OknoERP_HOST}/getcustomerschanges`, authParams, {});
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

  async deleteCustomersChanges(bodyData) {
    const data = requestDataHandler('POST',
      `${process.env.OknoERP_HOST}/deletechangesofcustomers`,
      authParams,
      bodyData);
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

  async getSalesOrders() {
    const data = requestDataHandler('GET', `${process.env.OknoERP_HOST}/getlist`, authParams, {});
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

  async getSalesOrdersChanges() {
    const data = requestDataHandler('GET', `${process.env.OknoERP_HOST}/getlistchanges`, authParams, {});
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

  async deleteSalesOrdersChanges(bodyData) {
    const data = requestDataHandler('POST',
      `${process.env.OknoERP_HOST}/deletechangesoflist`,
      authParams,
      bodyData);
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

  async getItems() {
    const data = requestDataHandler('GET', `${process.env.OknoERP_HOST}/getitems`, authParams, {});
    // try {
      const response = await axios(data);
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    // } catch (err) {
    //   console.log(err);
    //   throw err;
    // }
  }, 
  
  async getItemsChanges() {
    const data = requestDataHandler('GET', `${process.env.OknoERP_HOST}/getitemschanges`, authParams, {});
    // try {
      const response = await axios(data);
      if (response.status === 200) {
        return response.data;
      } else {
        return response;
      }
    // } catch (err) {
    //   console.log(err);
    //   throw err;
    // }
  },
  
  async deleteItemsChanges(bodyData) {
    const data = requestDataHandler('POST',
      `${process.env.OknoERP_HOST}/deletechangesofitems`,
      authParams,
      bodyData);
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
